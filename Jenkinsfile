pipeline {
    agent any

    environment {
        REMOTE_SERVER = 'remote@remote' // Change this to your remote server's username and address
        REMOTE_PATH = '/home/devops/jenkins' // Change this to the path where you want to store your project on the remote server
        NEXUS_URL = 'http://localhost:8081/repository/nodejs-repo/' // Change this to your Nexus repository URL
        ARTIFACT_NAME = 'myapp-v1.0.0.tar.gz'  // Change this to the name you want for your artifact
        GITHUB_REPO = 'https://github.com/Prasadrasal2002/nodejs-deployment-pipeline.git' // Change this to your GitHub repository URL
    }

    stages {
        // Stage 1: Set Up SSH and Git
        stage('Setup SSH and Git') {
            steps {
                script {
                    // Setup SSH connectivity (SSH key configured in Jenkins credentials)
                    sshagent(['jenkins-ssh-key']) {
                        // Pull code from GitHub to the remote server
                        sh 'ssh $REMOTE_SERVER "mkdir -p $REMOTE_PATH"' // Ensure the project directory exists on the remote server
                        sh 'scp -r . $REMOTE_SERVER:$REMOTE_PATH' // Copy the project files to the remote server (change the source path if necessary)
                    }
                }
            }
        }

        // Stage 2: Install Dependencies
        stage('Install Dependencies') {
            steps {
                script {
                    sshagent(['jenkins-ssh-key']) {
                        // SSH into the remote server and run npm install to install dependencies
                        sh 'ssh $REMOTE_SERVER "cd $REMOTE_PATH && npm install"'
                    }
                }
            }
        }

        // Stage 3: Build Project
        stage('Build Project') {
            steps {
                script {
                    sshagent(['jenkins-ssh-key']) {
                        // Run the build command on the remote server (ensure that your build command is correct)
                        sh 'ssh $REMOTE_SERVER "cd $REMOTE_PATH && npm run build"'
                    }
                }
            }
        }

        // Stage 4: Prepare Dist Folder
        stage('Prepare Dist Folder') {
            steps {
                script {
                    // Copy the dist folder or build files to Jenkins workspace (ensure that the path is correct)
                    sshagent(['jenkins-ssh-key']) {
                        sh 'scp $REMOTE_SERVER:$REMOTE_PATH/dist/* .' // Modify the path if your build directory differs
                    }
                }
            }
        }

        // Stage 5: Upload to Nexus
        stage('Upload to Nexus') {
            steps {
                script {
                    // Create a tarball of the built files (ensure the correct name is used)
                    sh 'npm pack'

                    // Upload the tarball to Nexus using curl (ensure the correct username, password, and Nexus URL are used)
                    sh 'curl -u admin:Pranali@28 --upload-file ./$ARTIFACT_NAME $NEXUS_URL' // Replace 'admin:Pranali@28' with your actual credentials if necessary
                }
            }
        }

        // Stage 6: Package Docker Image (Optional)
        stage('Package Docker Image') {
            steps {
                script {
                    // Build a Docker image for the application (Optional step; only if you are using Docker)
                    sh 'docker build -t myapp-image .' // Adjust the Docker image name if necessary
                }
            }
        }

        // Stage 7: Deploy (Optional)
        stage('Deploy') {
            steps {
                echo 'Deploying application to production...' // Modify the deployment steps if you have specific deployment commands
                // Additional deployment steps can be added here
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }

        success {
            echo 'Build completed successfully.'
        }

        failure {
            echo 'Build failed. Check logs for errors.'
        }
    }
}
