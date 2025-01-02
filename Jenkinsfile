pipeline {
    agent { label 'remote-node' }  // Use the remote-node as the agent for this pipeline
    
    environment {
        REMOTE_HOST = 'remote@remote'             // Remote server username and host
        REMOTE_PATH = '/home/devops/jenkins'     // Path on the remote server where files will be deployed
        LOCAL_PATH = "${WORKSPACE}"             // Local workspace directory in Jenkins
        SSH_PRIVATE_KEY = credentials('new-new')  // Fetching SSH key from Jenkins credentials
        NEXUS_USERNAME = 'admin'       // Nexus repository username
        NEXUS_PASSWORD = 'Pranali@28'       // Nexus repository password
        NEXUS_URL = 'http://localhost:8081/repository/nodejs-repo/' // Nexus repository URL
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
                archiveArtifacts artifacts: '*.tgz', fingerprint: true  // Archive the tarball in Jenkins
            }
        }

        stage('Deploy to Remote Server') {
            steps {
                echo 'Deploying project to remote server...'
                script {
                    writeFile file: '/tmp/deploy-key', text: SSH_PRIVATE_KEY
                    sh 'chmod 600 /tmp/deploy-key'  // Secure the private key
                    sh """
                        export SSHPATH='/tmp/deploy-key'
                        scp -i \$SSHPATH -r ${LOCAL_PATH}/* ${REMOTE_HOST}:${REMOTE_PATH}
                    """  // Copy files securely to the remote server
                }
            }
        }

        stage('Upload to Nexus') {
            steps {
                echo 'Uploading artifact to Nexus repository...'
                sh """
                    curl -u ${NEXUS_USERNAME}:${NEXUS_PASSWORD} --upload-file *.tgz ${NEXUS_URL}
                """  // Upload the tarball to Nexus
            }
        }

        stage('Test Nexus Artifact') {
            steps {
                echo 'Testing Nexus artifact availability...'
                sh """
                    curl -u ${NEXUS_USERNAME}:${NEXUS_PASSWORD} -I ${NEXUS_URL}/<artifact-name>.tgz
                """  // Replace <artifact-name> with the name of your tarball
            }
        }
    }

    post {
        always {
            echo 'Cleaning up temporary files...'
            sh 'rm -f /tmp/deploy-key'  // Remove the private key for security
        }
    }
}
