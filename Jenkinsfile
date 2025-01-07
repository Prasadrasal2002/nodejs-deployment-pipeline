pipeline {
    agent { label 'nodejs' }

    environment {
        REMOTE_HOST = 'remote@192.68.128.75'
        REMOTE_PATH = '/home/devops/jenkins'
        SSH_PRIVATE_KEY = credentials('node-token')   // SSH credential ID
        GIT_CREDENTIALS = 'nodejs-pat'               // GitHub personal access token ID
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                git credentialsId: GIT_CREDENTIALS, url: 'https://github.com/Prasadrasal2002/nodejs-deployment-pipeline.git', branch: 'main'
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

        stage('Deploy to Remote') {
            steps {
                sshagent(credentials: ['node-token']) {
                    sh """
                    ssh -o 'StrictHostKeyChecking=no' -o 'UserKnownHostsFile=/dev/null' $REMOTE_HOST 'bash -c "cd $REMOTE_PATH && npm install && npm run build"'
                    """
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
