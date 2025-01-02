pipeline {
    agent { label 'remote-node' }  // Use the remote-node as the agent for this pipeline
    
    environment {
        // Set up any environment variables you need
        REMOTE_HOST = 'user@remote'             // Remote server username and host
        REMOTE_PATH = '/path/to/destination'    // Path on the remote server where files will be deployed
        LOCAL_PATH = '/path/to/files'           // Local path to files that need to be deployed
        SSH_PRIVATE_KEY = credentials('your-ssh-credentials-id')  // Fetching SSH key from Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm  // Checkout the code from the configured source control
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                // Add your build steps here (e.g., npm install, npm build, etc.)
                sh 'npm install'  // Install dependencies
                sh 'npm run build'  // Build the project
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add your test steps here (e.g., unit tests, integration tests, etc.)
                sh 'npm test'  // Run the tests
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying project to remote server...'

                // Make sure the private key is available and use it with ssh-agent for secure deployment
                script {
                    // Write the private key to a temporary file for use
                    writeFile file: '/tmp/deploy-key', text: SSH_PRIVATE_KEY
                    sh 'chmod 600 /tmp/deploy-key'  // Secure the private key
                    sh """
                        export SSHPATH='/tmp/deploy-key'
                        scp -i \$SSHPATH -r ${LOCAL_PATH} ${REMOTE_HOST}:${REMOTE_PATH}
                    """  // Use SCP to securely copy files to the remote server
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // Clean up any resources if needed
            sh 'rm -f /tmp/deploy-key'  // Remove the private key after use to keep it secure
        }
    }
}
