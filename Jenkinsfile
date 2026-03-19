pipeline {
    agent any 

    environment {
        DOCKER_USER = "your_username"
        REPO_NAME   = "angular-docker"
        DOCKER_HUB_AUTH = credentials('docker-hub-creds')
    }

    stages {
        stage('Checkout') {
            steps {
                // Equivalent to actions/checkout@v4
                checkout scm 
            }
        }

        stage('Install & Test') {
            // This stage runs on EVERY branch (PRs and Main)
            steps {
                sh 'npm ci'
                // We use --browsers=ChromeHeadless because Jenkins doesn't have a screen
                sh 'npm test -- --watch=false --browsers=ChromeHeadless'
                sh 'npm run build'
            }
        }

        stage('Docker Build & Push') {
            // This ONLY runs if we are on the 'main' branch
            // Equivalent to your 'on: push: branches: [main]'
            when {
                branch 'main'
            }
            steps {
                script {
                    String shortSha = env.GIT_COMMIT.take(7)
                    def tags = ["${DOCKER_USER}/${REPO_NAME}:latest", "${DOCKER_USER}/${REPO_NAME}:${shortSha}"]
                    
                    def tagArgs = tags.collect { "-t ${it}" }.join(' ')
                    sh "docker build ${tagArgs} ."

                    sh "echo ${DOCKER_HUB_AUTH_PSW} | docker login -u ${DOCKER_HUB_AUTH_USR} --password-stdin"
                    
                    tags.each { tag ->
                        sh "docker push ${tag}"
                    }
                }
            }
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