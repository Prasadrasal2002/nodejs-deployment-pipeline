pipeline {
    agent any
    
    environment {
        // Set up any environment variables you need
        REMOTE_HOST = 'user@remote'
        REMOTE_PATH = '/path/to/destination'
        LOCAL_PATH = '/path/to/files'
        SSH_PRIVATE_KEY = credentials('your-ssh-credentials-id')  // Fetching SSH key from Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                // Add your build steps here (e.g., compile, package, etc.)
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add your test steps here (e.g., unit tests, integration tests, etc.)
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying project to remote server...'
                
                // Make sure the private key is available and use it with ssh-agent for secure deployment
                script {
                    // Here, the 'sh' step will be used to securely connect and deploy files
                    writeFile file: '/tmp/deploy-key', text: SSH_PRIVATE_KEY
                    sh 'chmod 600 /tmp/deploy-key' // Secure the private key
                    sh """
                        export SSHPATH='/tmp/deploy-key'
                        scp -i \$SSHPATH -r ${LOCAL_PATH} ${REMOTE_HOST}:${REMOTE_PATH}
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // Clean up any resources if needed
            sh 'rm -f /tmp/deploy-key' // Remove the private key after use
        }
    }
}
