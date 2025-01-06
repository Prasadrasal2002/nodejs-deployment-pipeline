pipeline {
    agent { label 'nodejs' }

    environment {
        REMOTE_HOST = 'devops@10.0.2.15' // Replace with your actual remote server IP or domain
        REMOTE_PATH = '/home/devops/jenkins'
        SSH_PRIVATE_KEY = credentials('node')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Debug Workspace') {
            steps {
                echo 'Listing workspace contents for debugging...'
                sh 'ls -al'
            }
        }

        stage('Verify Node.js and npm') {
            steps {
                echo 'Verifying Node.js and npm versions...'
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }

        stage('Package') {
            steps {
                echo 'Packaging the application...'
                sh 'npm pack'
                archiveArtifacts artifacts: '*.tgz', fingerprint: true
            }
        }

        stage('Deploy to Remote Server') {
            steps {
                sshagent(credentials: ['node']) {
                    script {
                        try {
                            sh 'ssh -v ${REMOTE_HOST} echo "Connection successful"'
                        } catch (Exception e) {
                            echo "Error encountered while connecting to the remote server: ${e.getMessage()}"
                        }
                    }
                }
            }
        }

        stage('Upload to Nexus') {
            steps {
                echo 'Uploading to Nexus repository...'
                sh 'curl -u admin:Pranali@28 --upload-file *.tgz http://localhost:8081/repository/nodejs-repo/'
            }
        }

        stage('Test Nexus Artifact') {
            steps {
                echo 'Testing Nexus artifact availability...'
                sh 'curl -u admin:Pranali@28 -I http://localhost:8081/repository/nodejs-repo/'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up temporary files...'
            sh 'rm -f /tmp/deploy-key'
        }
    }
}
