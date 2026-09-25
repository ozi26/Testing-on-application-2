// Jenkins pipeline: installs dependencies, runs tests, and validates the Docker Compose configuration.
pipeline {
  // Allows Jenkins to choose any available build agent.
  agent any
  // Defines reusable pipeline stages.
  stages {
    // Installs Node.js dependencies.
    stage('Install') {
      steps {
        // Installs the exact dependencies described by package.json.
        sh 'npm install'
      }
    }
    // Runs unit and integration tests.
    stage('Test') {
      steps {
        // Executes the complete Jest test suite.
        sh 'npm test'
      }
    }
    // Validates the Docker Compose file.
    stage('Compose Validate') {
      steps {
        // Checks that the Compose file is syntactically valid.
        sh 'docker compose config'
      }
    }
  }
  // Always publishes the test result information when Jenkins has the plugin available.
  post {
    always {
      // Prints a final build message.
      echo 'E-commerce pipeline finished.'
    }
  }
}
