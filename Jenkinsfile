pipeline {
    agent { label 'agentubuntu' }

    tools {
        nodejs 'node'
    }

    environment {
        REMOTE_HOST = '192.168.244.117' // IP/hostname of the remote server
        REMOTE_USER = 'jenkins'        // Username for SSH connection
        REMOTE_PATH = '/home/devops/jenkins'
        GIT_CREDENTIALS = 'new-git-crd' // GitHub personal access token ID
        NEXUS_URL = 'http://192.168.244.170:8081/repository/nodejs-repo/'
        NEXUS_CREDENTIALS = 'nexus-credentials-id' // Nexus credentials ID
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
                        scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i $SSH_KEY *.tgz ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}
                        ssh -i $SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_PATH} && tar -xvf *.tgz && npm install"
                    ''', returnStatus: true)
                }
            }
        }

        stage('Upload to Nexus') {
            steps {
                echo 'Uploading artifact to Nexus repository...'
                withCredentials([usernamePassword(credentialsId: NEXUS_CREDENTIALS, usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh(script: '''
                        curl -v -u $NEXUS_USER:$NEXUS_PASS \
     --upload-file simpletodoapp-1.0.0.tgz \
     http://192.168.244.170:8081/repository/nodejs-repo/simpletodoapp-1.0.0.tgz

                    ''')
                }
            }
        }

        stage('Verify API Endpoints') {
            steps {
                echo 'Testing API endpoints...'
                sh 'curl -X GET http://192.168.244.170:3000/api/endpoint -w "\\nResponse: %{http_code}\\n"'
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
