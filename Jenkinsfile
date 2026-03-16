pipeline {
    agent any

    environment {
        DOTNET_CONFIGURATION = 'Release'
        SOLUTION_NAME = 'Jenkins.sln'
        NODE_VERSION = '' 
        ANGULAR_VERSION = ''
        DOTNET_VERSION = ''

        // AWS Configuration
        AWS_REGION = 'ap-south-1'
        S3_BUCKET = 'price-list-app-frontend'

        //Elastic Beanstalk Configuration
        EB_APP_NAME = 'price-list-api'
        EB_ENV_NAME = 'price-list-api-env'
    }
    
    stages {

        stage('Build Angular App') {
            steps {
                echo 'Building Angular app...'
                dir('UI') {
                    sh 'npm ci'
                    script{
                        NODE_VERSION = sh(script: "node --version", returnStdout: true).trim()
                        ANGULAR_VERSION = sh(script: './node_modules/.bin/ng version | grep "Angular CLI" | awk \'{print $3}\'', returnStdout: true).trim()
                    }
                    sh 'npm run build'
                }
            }
        }
        
        stage('Test Angular App') {
            steps {
                echo 'Running Angular tests...'
                dir('UI') {
                     sh 'npm run test -- --watch=false --browsers=ChromiumHeadlessCI'
                }
            }
        }

        stage('Deploy Angular to S3') {
            steps {
                echo 'Deploying Angular app to S3...'
                script {
                    // Use withCredentials for secure credential handling
                    withCredentials([
                        string(credentialsId: 'aws-access-key-id', variable: 'AWS_KEY'),
                        string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET')
                    ]) {
                        dir('UI/dist/product-catelogue/browser') {
                            sh '''
                                export AWS_ACCESS_KEY_ID=$AWS_KEY
                                export AWS_SECRET_ACCESS_KEY=$AWS_SECRET
                                export AWS_DEFAULT_REGION=${AWS_REGION}
                                
                                aws s3 sync . s3://${S3_BUCKET}/ --delete
                            '''
                        }
                    }
                    
                    echo 'Angular app deployed to S3 successfully!'
                }
            }
        }

        stage('Build .NET API') {

            steps {
                script{
                    def version = sh(script: "dotnet --version", returnStdout: true).trim()
                    DOTNET_VERSION = version
                    sh "echo Build .NET API: Building with .NET version: ${version}"
                    sh "echo ${version} > dotnet-version.txt" 
                }
                echo 'Building .NET API...'
                sh "dotnet restore ${SOLUTION_NAME}"
                sh "dotnet build ${SOLUTION_NAME} --configuration ${DOTNET_CONFIGURATION} --no-restore"
            }
        }

        stage('Test .NET API') {
            steps {
                script{
                    def versionFromBuildStage = readFile('dotnet-version.txt').trim();
                    sh "echo Test .NET API: Testing with .NET version: ${versionFromBuildStage}"
                }
                echo 'Running .NET tests...'
                sh "dotnet test ${SOLUTION_NAME} --configuration ${DOTNET_CONFIGURATION} --no-build --logger \"trx;LogFileName=test-results.trx\""
            }
        }

        stage('Deploy .NET API to elastic beanstalk') {
            steps {
                echo 'Deploying .NET API to Elastic Beanstalk...'
                script{
                    withCredentials([
                        string(credentialsId: 'aws-access-key-id', variable: 'AWS_KEY'),
                        string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET')
                    ]){
                        sh "dotnet publish ${SOLUTION_NAME} -c ${DOTNET_CONFIGURATION} -o ./publish"

                        dir('publish') {
                            sh 'zip -r ../dotnet-deployment.zip .'
                        }

                        // Deploy to Elastic Beanstalk using AWS CLI
                        sh '''#!/bin/bash
                            export AWS_ACCESS_KEY_ID=$AWS_KEY
                            export AWS_SECRET_ACCESS_KEY=$AWS_SECRET
                            export AWS_DEFAULT_REGION=${AWS_REGION}

                            # Create unique version label with timestamp
                            TIMESTAMP=$(date +%Y%m%d-%H%M%S)
                            VERSION_LABEL="v${BUILD_NUMBER}-${TIMESTAMP}"

                            # Upload to S3 (EB uses S3 for deployments)
                            aws s3 cp dotnet-deployment.zip s3://elasticbeanstalk-${AWS_REGION}-$(aws sts get-caller-identity --query Account --output text)/${EB_APP_NAME}/${VERSION_LABEL}.zip

                            # Create application version
                            aws elasticbeanstalk create-application-version \
                                --application-name ${EB_APP_NAME} \
                                --version-label ${VERSION_LABEL} \
                                --source-bundle S3Bucket="elasticbeanstalk-${AWS_REGION}-$(aws sts get-caller-identity --query Account --output text)",S3Key="${EB_APP_NAME}/${VERSION_LABEL}.zip"
                            
                            # Deploy to environment
                            aws elasticbeanstalk update-environment \
                                --application-name ${EB_APP_NAME} \
                                --environment-name ${EB_ENV_NAME} \
                                --version-label ${VERSION_LABEL}
                            
                            echo "Deployment initiated. Version: ${VERSION_LABEL}"
                        '''
                        // Clean up
                        sh 'rm -rf publish dotnet-deployment.zip'
                    }
                    echo '.NET API deployment initiated!'
                }
            }
        }
        stage('Build Summary') {
            steps {
                echo "================================="
                echo "Build Summary"
                echo "================================="
                echo "Angular CLI Version : ${ANGULAR_VERSION}"
                echo "Node.js Version     : ${NODE_VERSION}"
                echo ".NET Version        : ${DOTNET_VERSION}"
                echo "Configuration       : ${DOTNET_CONFIGURATION}"
                echo "================================="
            }
        }
    }
    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}