pipeline {
    agent any
    stages {
        stage('Set Up Workspace') {
            steps {
                echo 'Listing files in workspace:'
                sh 'ls -la' // Verify initial workspace contents
            }
        }
        stage('Navigate to Project Directory') {
            steps {
                dir('SimpleTodoApp') { // Navigate to the correct folder
                    echo 'Inside SimpleTodoApp folder'
                    sh 'ls -la' // Verify contents of SimpleTodoApp
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                dir('SimpleTodoApp') { // Ensure commands run inside the project folder
                    sh 'npm install'
                }
            }
        }
        stage('Build Project') {
            steps {
                dir('SimpleTodoApp') {
                    sh 'npm run build' // Replace with your actual build command if different
                }
            }
        }
        stage('Archive Artifacts') {
            steps {
                dir('SimpleTodoApp') {
                    archiveArtifacts artifacts: 'build/**', fingerprint: true
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline has completed.'
        }
        success {
            echo 'Build completed successfully.'
        }
        failure {
            echo 'Build failed. Check the logs for errors.'
        }
    }
}

