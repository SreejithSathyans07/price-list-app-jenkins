pipeline {
    agent any
    
    stages {

        stage('Build Angular App') {
            steps {
                echo 'Building Angular app...'
                dir('UI') {
                    sh 'npm ci'
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

        stage('Build .NET API') {
            steps {
                echo 'Building .NET API...'
                sh 'dotnet restore Jenkins.sln'
                sh 'dotnet build Jenkins.sln --configuration Release --no-restore'
            }
        }

        stage('Test .NET API') {
            steps {
                echo 'Running .NET tests...'
                sh 'dotnet test Jenkins.sln --configuration Release --no-build --logger "trx;LogFileName=test-results.trx"'
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
}