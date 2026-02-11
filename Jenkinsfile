pipeline {
    agent any

    environment {
        DOTNET_CONFIGURATION = 'Release'
        SOLUTION_NAME = 'Jenkins.sln'
        NODE_VERSION = '' 
        ANGULAR_VERSION = ''
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

        stage('Build .NET API') {

            steps {
                script{
                    def version = sh(script: "dotnet --version", returnStdout: true).trim()
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