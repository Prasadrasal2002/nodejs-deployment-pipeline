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
                    sh 'npm run build || echo "No build process required"' // Handle projects with no build
                }
            }
        }
        stage('Archive Artifacts') {
            steps {
                dir('SimpleTodoApp') {
                    script {
                        def buildExists = sh(script: 'test -d build && echo "exists" || echo "not found"', returnStdout: true).trim()
                        if (buildExists == "exists") {
                            archiveArtifacts artifacts: 'build/**', fingerprint: true
                        } else {
                            echo "No build artifacts to archive."
                        }
                    }
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
