pipeline {
    agent { label 'agentubuntu' }
    
    tools {
        nodejs 'node'
    }

    environment {
        REMOTE_HOST = '192.168.244.117' // Only the IP/hostname of the remote server
        REMOTE_USER = 'ubuntu'        // Username for SSH connection
        REMOTE_PATH = '/home/devops/jenkins'
        GIT_CREDENTIALS = 'new-git-crd' // GitHub personal access token ID
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                git credentialsId: GIT_CREDENTIALS, url: 'https://github.com/Prasadrasal2002/nodejs-deployment-pipeline.git', branch: 'main'
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

        stage('Deploy to Remote') {
            steps {
                echo 'Deploying package to remote server...'
                withCredentials([sshUserPrivateKey(credentialsId: 'jenkins-ssh-final', keyFileVariable: 'SSH_KEY')]) {
                    sh(script: '''
                           scp -v -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i $SSH_KEY *.tgz ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}
                        ''', returnStatus: true)
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
