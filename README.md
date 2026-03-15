# Angular App - Automated S3 Deployment

## Overview

Automated CI/CD pipeline that builds, tests, and deploys the Angular application to AWS S3 on every code push to GitHub.

## Prerequisites

- AWS Account with S3 bucket created (`price-list-app-frontend`)
- IAM user with S3 permissions
- Jenkins with AWS CLI installed
- Docker with platform support for linux/amd64

## Setup Steps

### 1. AWS Configuration

#### 1.1 S3 Bucket Setup
- **Created S3 Bucket:** `price-list-app-frontend` in `ap-south-1` region
- **Enabled Static Website Hosting:** Index document set to `index.html`
- **Configured Bucket Policy:** Public read access for static hosting

#### 1.2 IAM User Setup
- **Created IAM User:** `jenkins-deployment-user`
- **Attached Policy:** `AmazonS3FullAccess`
- **Generated Access Keys:** Access Key ID and Secret Access Key

### 2. Jenkins Configuration

#### 2.1 Install AWS CLI
Added AWS CLI installation to Jenkins Docker container via `Dockerfile`:
```dockerfile
# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws
```

#### 2.2 Store AWS Credentials
Stored AWS credentials securely in Jenkins:
- **Credential ID:** `aws-access-key-id` (Secret text)
- **Credential ID:** `aws-secret-access-key` (Secret text)

Navigate to: **Jenkins → Manage Jenkins → Credentials → Add Credentials**

#### 2.3 Docker Platform Configuration
Updated `docker-compose.yml` for Mac Apple Silicon compatibility:
```yaml
services:
  jenkins:
    build: .
    platform: linux/amd64
    # ... other config
```

### 3. Pipeline Implementation

#### 3.1 Deployment Stage
Added deployment stage to `Jenkinsfile`:
```groovy
stage('Deploy Angular to S3') {
    steps {
        echo 'Deploying Angular app to S3...'
        script {
            withCredentials([
                string(credentialsId: 'aws-access-key-id', variable: 'AWS_KEY'),
                string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET')
            ]) {
                dir('UI/dist/product-catelogue/browser') {
                    sh '''
                        export AWS_ACCESS_KEY_ID=$AWS_KEY
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET
                        export AWS_DEFAULT_REGION=ap-south-1
                        
                        aws s3 sync . s3://price-list-app-frontend/ --delete
                    '''
                }
            }
            echo 'Angular app deployed to S3 successfully!'
        }
    }
}
```

#### 3.2 Key Features
- **Secure Credentials:** Uses `withCredentials` for secure credential handling
- **AWS CLI Configuration:** Sets credentials and region via environment variables
- **Sync with Cleanup:** `aws s3 sync --delete` removes old build artifacts
- **Production Build:** Uses environment-specific configuration

## Deployment Flow
```
Code Push → GitHub → Jenkins Webhook → Build Angular → Run Tests → Deploy to S3 → Live
```

## Pipeline Stages

1. **Build Angular App** - Install dependencies and build production bundle
2. **Test Angular App** - Run unit tests with ChromiumHeadless
3. **Deploy Angular to S3** - Sync build files to S3 bucket
4. **Build .NET API** - Build backend application
5. **Test .NET API** - Run backend unit tests
6. **Build Summary** - Display version information

## Key Features

- ✅ Fully automated deployment on git push
- ✅ Secure credential management via Jenkins
- ✅ Automatic cleanup of old build files (`--delete` flag)
- ✅ Production build with environment-specific configuration
- ✅ Zero-downtime deployments


## Files Modified

- `Jenkinsfile` - Added S3 deployment stage
- `Dockerfile` - Added AWS CLI installation
- `docker-compose.yml` - Added platform support for Apple Silicon
- `UI/src/environments/environment.prod.ts` - AWS API endpoint configuration

## Troubleshooting

### Rosetta Error on Mac (Apple Silicon)
**Error:** `rosetta error: failed to open elf at /lib64/ld-linux-x86-64.so.2`

**Solution:** Add `platform: linux/amd64` to `docker-compose.yml`

### AWS CLI Not Found
**Error:** `aws: command not found`

**Solution:** Rebuild Docker container with AWS CLI installed:
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Credentials Warning
**Warning:** `A secret was passed to "sh" using Groovy String interpolation`

**Solution:** Use `withCredentials` block instead of direct variable interpolation
