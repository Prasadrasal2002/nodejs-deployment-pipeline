pipeline {
    agent { label 'remote-node' }

    environment {
        REMOTE_SERVER = 'remote@remote' // Update with your remote server username and address
        REMOTE_PATH = '/home/devops/jenkins' // Update with your desired path on the remote server
        NEXUS_URL = 'http://localhost:8081/repository/nodejs-repo/' // Update with your Nexus repository URL
        ARTIFACT_NAME = 'myapp-v1.0.0.tar.gz' // Update with your desired artifact name
        GITHUB_REPO = 'https://github.com/Prasadrasal2002/nodejs-deployment-pipeline.git' // Update with your GitHub repository URL
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: "${env.GITHUB_REPO}"
            }
        }

        stage('Setup Remote Directory') {
            steps {
                script {
                    sshagent(['jenkins-ssh-key']) {
                        sh "ssh $REMOTE_SERVER 'mkdir -p $REMOTE_PATH'"
                    }
                }
            }
        }

        stage('Copy Files to Remote Server') {
            steps {
                script {
                    sshagent(['jenkins-ssh-key']) {
                        sh "scp -r . $REMOTE_SERVER:$REMOTE_PATH"
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sshagent(['jenkins-ssh-key']) {
                        sh "ssh $REMOTE_SERVER 'cd $REMOTE_PATH && npm install'"
                    }
                }
            }
        }

        stage('Build Project') {
            steps {
                script {
                    sshagent(['jenkins-ssh-key']) {
                        sh "ssh $REMOTE_SERVER 'cd $REMOTE_PATH && npm run build'"
                    }
                }
            }
        }

        stage('Package Artifact') {
            steps {
                script {
                    sshagent(['jenkins-ssh-key']) {
                        sh "ssh $REMOTE_SERVER 'cd $REMOTE_PATH && tar -czf $ARTIFACT_NAME dist'"
                        sh "scp $REMOTE_SERVER:$REMOTE_PATH/$ARTIFACT_NAME ."
                    }
                }
            }
        }

        stage('Upload to Nexus') {
            steps {
                script {
                    sh "curl -u admin:Pranali@28 --upload-file ./$ARTIFACT_NAME $NEXUS_URL"
                }
            }
        }

        stage('Dockerize (Optional)') {
            steps {
                script {
                    sh "docker build -t myapp-image ."
                }
            }
        }

        stage('Deploy (Optional)') {
            steps {
                echo "Deploying application to production..."
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
