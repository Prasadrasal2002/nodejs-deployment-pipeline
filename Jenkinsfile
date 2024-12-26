pipeline {
    agent none  // The main Jenkins server won't be used for the build

    stages {
        stage('Setup Node.js and npm on Remote Server') {
            agent { label 'remote-node' } // This runs on the agent with Node.js installed
            steps {
                script {
                    // SSH into the remote server
                    sh 'ssh -o StrictHostKeyChecking=no user@remote-server "node -v && npm -v"'
                }
            }
        }

        stage('Install Dependencies') {
            agent { label 'remote-node' }
            steps {
                script {
                    // Run npm install on the remote server
                    sh 'ssh user@remote-server "cd /path/to/project && npm install"'
                }
            }
        }

        stage('Build Application') {
            agent { label 'remote-node' }
            steps {
                script {
                    // Run build commands on the remote server
                    sh 'ssh user@remote-server "cd /path/to/project && npm run build"'
                }
            }
        }

        stage('Prepare Dist Folder') {
            agent { label 'remote-node' }
            steps {
                script {
                    // Example: Collect build artifacts into the dist folder
                    sh 'ssh user@remote-server "cd /path/to/project && npm run package"'
                }
            }
        }

        stage('Upload to Nexus') {
            agent { label 'remote-node' }
            steps {
                script {
                    // Example of npm pack and upload the artifact to Nexus repository
                    sh 'ssh user@remote-server "cd /path/to/project && npm pack"'
                    sh 'curl -u "user:password" --upload-file ./project-name-version.tgz "http://nexus-repo/repository/npm-repository/"'
                }
            }
        }

        stage('Package Application') {
            steps {
                script {
                    // Create a tarball or Docker image, depending on your deployment
                    sh 'tar -czvf project-name.tar.gz /path/to/dist/'
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'project-name.tar.gz'
                }
            }
        }
    }

    post {
        always {
            // Clean up or post build actions if needed
            cleanWs()
        }
    }
}
