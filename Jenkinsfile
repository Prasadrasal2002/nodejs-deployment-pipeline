pipeline {
    agent any  // Use any available Jenkins agent

    tools {
        nodejs 'nodejs'
    }

    environment {
        GIT_CREDENTIALS = 'jenkins-github-pat'  // GitHub credentials ID
        NEXUS_URL = 'http://host.docker.internal:8081/repository/maven-releases/' // Use host.docker.internal for Nexus
        NEXUS_CREDENTIALS = 'nexus' // Nexus credentials ID
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                git branch: 'main', credentialsId: "${GIT_CREDENTIALS}", url: 'https://github.com/Prasadrasal2002/nodejs-deployment-pipeline.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Package') {
            steps {
                echo 'Packaging the application...'
                sh 'npm pack'
                script {
                    def tgzFile = sh(script: "ls *.tgz", returnStdout: true).trim()
                    env.PACKAGE_NAME = tgzFile
                }
                archiveArtifacts artifacts: '*.tgz', fingerprint: true
            }
        }

        stage('Upload to Nexus') {
            steps {
                echo 'Uploading artifact to Nexus repository...'
                withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIALS}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh """
                        curl -v -u \$NEXUS_USER:\$NEXUS_PASS --upload-file \$WORKSPACE/\$PACKAGE_NAME ${NEXUS_URL}\$PACKAGE_NAME
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
