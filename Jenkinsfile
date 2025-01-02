pipeline {
    agent { label 'remote-node' }  // Use the remote-node agent for this pipeline

    environment {
        REMOTE_HOST = 'remote@remote'             // Remote server username and host
        REMOTE_PATH = '/home/devops/jenkins'      // Path on the remote server where files will be deployed
        LOCAL_PATH = "${env.WORKSPACE}/dist"      // Build artifacts located in the dist folder after the build
        SSH_PRIVATE_KEY = credentials('new-new')  // Fetch SSH key from Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm  // Checkout the code from the source control configured in Jenkins
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                // Install dependencies and build the project
                sh 'npm install'  
                sh 'npm run build'  
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Run project tests
                sh 'npm test'  
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying project to remote server...'
                script {
                    // Write the SSH private key to a temporary file for secure usage
                    writeFile file: '/tmp/deploy-key', text: SSH_PRIVATE_KEY
                    sh 'chmod 600 /tmp/deploy-key'  // Set permissions for the private key
                    sh """
                        export SSHPATH='/tmp/deploy-key'
                        scp -i \$SSHPATH -r ${LOCAL_PATH} ${REMOTE_HOST}:${REMOTE_PATH}
                    """  // Securely copy build artifacts to the remote server
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up temporary files...'
            // Remove the temporary private key file to ensure security
            sh 'rm -f /tmp/deploy-key'
        }
    }
}
