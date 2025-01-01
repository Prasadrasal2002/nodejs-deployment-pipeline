pipeline {
    agent { label 'remote-node' }

    stages {
        stage('Checkout Code') {
            steps {
                // Pull the application code from Git repository
                git branch: 'main', url: 'https://github.com/Prasadrasal2002/nodejs-deployment-pipeline.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install npm dependencies
                sh 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                // Build the project to generate files in the dist folder
                sh 'npm run build'
            }
        }

        stage('Archive Artifacts') {
            steps {
                // Archive the dist folder as an artifact
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }
}
