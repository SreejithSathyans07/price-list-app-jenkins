pipeline {
    agent any
    
    stages {
        stage('Build .NET API') {
            steps {
                echo 'Building .NET API...'
                sh 'dotnet restore Jenkins.sln'
                sh 'dotnet build Jenkins.sln --configuration Release --no-restore'
            }
        }
    }
}