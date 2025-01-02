pipeline {
    agent { label 'remote-node' } // Use the remote-node as the agent for this pipeline
    
    environment {
        REMOTE_HOST = 'remote@remote'              // Remote server username and host
        REMOTE_PATH = '/home/devops/jenkins'       // Path on the remote server where files will be deployed
        SSH_PRIVATE_KEY = credentials('new-new')   // Fetching SSH key from Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm  // Checkout the code from the configured source control
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
                sh 'npm install'  // Install dependencies
                sh 'npm run build'  // Build the project
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'  // Run the tests
            }
        }

        stage('Package') {
            steps {
                echo 'Packaging the application...'
                sh 'npm pack'  // Package the project into a tarball
                archiveArtifacts artifacts: '*.tgz', fingerprint: true  // Archive the package
            }
        }

        stage('Deploy to Remote Server') {
            steps {
                sshagent(credentials: ['new-new']) {
                    sh '''
                        scp -r /home/devops/jenkins/workspace/nodejs-pipeline/* remote@remote:/home/devops/jenkins
                    '''
                }
            }
        }

        stage('Upload to Nexus') {
            steps {
                echo 'Uploading to Nexus repository...'
                sh 'curl -u nexus-username:nexus-password --upload-file *.tgz http://localhost:8081/repository/nodejs-repo/'
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
            sh 'rm -f /tmp/deploy-key'  // Remove the private key after use to keep it secure
        }
    }
}
