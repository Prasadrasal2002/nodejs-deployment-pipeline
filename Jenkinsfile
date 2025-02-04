pipeline {
    agent { label 'agentubuntu' }

    tools {
        nodejs 'node'
    }

   environment {
    REMOTE_HOST = '192.168.104.117' // IP/hostname of the remote server
    REMOTE_USER = 'jenkins'        // Username for SSH connection
    REMOTE_PATH = '/home/jenkins'
    GIT_CREDENTIALS = 'new-git-crd' // GitHub personal access token ID
    NEXUS_URL = 'http://localhost:8081/repository/nodejs-repo/' // Nexus URL for uploading artifacts
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
                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i $SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} \
    "cd ${REMOTE_PATH} && tar -xvf *.tgz && cd package && npm install"


                    ''', returnStatus: true)
                }
            }
        }

       stage('Upload to Nexus') {
    steps {
        echo 'Uploading artifact to Nexus repository...'
        withCredentials([usernamePassword(credentialsId: NEXUS_CREDENTIALS, usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
            sh(script: '''
                curl -v -u  $NEXUS_USER:$NEXUS_PASS --upload-file ${WORKSPACE}/simpletodoapp-1.0.0.tgz ${NEXUS_URL}simpletodoapp-1.0.0.tgz
            ''')
        }
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
