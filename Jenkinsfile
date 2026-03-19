pipeline {
    agent any

    environment {
        DOCKER_USER = "baccichet"
        REPO_NAME   = "angular-docker"
        DOCKER_CREDS = credentials('docker-hub-creds')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Quality Check') {
            agent {
                // This is the "furniture" we are bringing in
                docker { image 'node:20-alpine' } 
            }
            steps {
                sh 'npm ci'
                sh 'npm run build'
                sh "npm test -- --watch=false --browsers=chromium"
            }
        }

        stage('Docker Publish') {
            agent any // This stage uses your host's Docker engine
            // ONLY runs on 'main' branch or when you push a Git Tag (v1.0.0)
            when {
                anyOf {
                    branch 'main'
                    buildingTag()
                }
            }
            steps {
                script {
                    // Initialize the list with 'latest'
                    def tags = ["${DOCKER_USER}/${REPO_NAME}:latest"]
                    
                    // Add specific version tags
                    if (env.TAG_NAME) {
                        tags.add("${DOCKER_USER}/${REPO_NAME}:${env.TAG_NAME}")
                    } else {
                        // Use a short SHA for main branch pushes
                        String shortSha = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                        tags.add("${DOCKER_USER}/${REPO_NAME}:${shortSha}")
                    }

                    // Build image with all tags
                    def tagArgs = tags.collect { "-t ${it}" }.join(' ')
                    sh "docker build ${tagArgs} ."

                    // Secure Login and Push
                    sh "echo ${DOCKER_CREDS_PSW} | docker login -u ${DOCKER_CREDS_USR} --password-stdin"
                    
                    tags.each { tag ->
                        sh "docker push ${tag}"
                    }
                }
            }
        }
    }

    post {
        always {
            // Cleanup: remove the image locally to save disk space on the server
            sh "docker logout"
        }
        failure {
            echo "Build failed! Check the logs for errors."
        }
    }
}

  //docker run -d \
  //-p 8080:8080 \
  //-p 50000:50000 \
  //-v jenkins_home:/var/jenkins_home \
  //-v //var/run/docker.sock:/var/run/docker.sock \
  //--name my-jenkins \
  //jenkins/jenkins:lts