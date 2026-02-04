pipeline {
    agent any
    
    stages {
        stage('Check .NET Version') {
            steps {
                sh 'dotnet --version'
            }
        }
        
        stage('Check Node.js Version') {
            steps {
                sh 'node --version'
            }
        }
        
        stage('Check npm Version') {
            steps {
                sh 'npm --version'
            }
        }
        
        stage('Check Chrome Version') {
            steps {
                sh 'google-chrome --version'
            }
        }
    }
}