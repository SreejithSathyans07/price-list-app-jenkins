pipeline {
    agent any
    
    stages {

        stage('Test .NET API') {
            steps {
                echo 'Running .NET tests...'
                sh 'dotnet test Jenkins.sln --configuration Release --no-build --logger "trx;LogFileName=test-results.trx"'
            }
        }

        stage('Build .NET API') {
            steps {
                echo 'Building .NET API...'
                sh 'dotnet restore Jenkins.sln'
                sh 'dotnet build Jenkins.sln --configuration Release --no-restore'
            }
        }
    }
}