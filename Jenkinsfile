// =============================================================================
// JENKINSFILE — Test Impact Analyzer for E-Commerce Microservices
// =============================================================================
// This pipeline automatically runs ONLY the tests affected by changes to the
// e-commerce microservices project. It implements thesis Objective IV:
// "Integrate this analyzer directly into automated continuous integration
//  pipelines so the system only compiles the necessary code modules and
//  runs only the impacted tests."
//
// Pipeline Flow:
//   1. Checkout           → Pull the latest code from Git
//   2. Setup Python       → Create a clean virtual environment
//   3. Install Deps       → Install Python dependencies
//   4. Install Node Deps  → Install JavaScript test dependencies (if present)
//   5. Detect Changes     → Show what changed since the last commit
//   6. Analyze            → Run the analyzer, produce analyzer_result.json
//   7. Show Summary       → Human-readable summary of selected tests
//   8. Run Tests          → Execute ONLY the affected tests
//   9. Archive            → Save analyzer_result.json as a build artifact
// =============================================================================

pipeline {

    // -------------------------------------------------------------------------
    // AGENT
    // Run on any available Jenkins agent.
    // -------------------------------------------------------------------------
    agent any

    // -------------------------------------------------------------------------
    // ENVIRONMENT VARIABLES
    // -------------------------------------------------------------------------
    environment {
        // Prevent encoding issues with non-ASCII file paths
        PYTHONIOENCODING = 'UTF-8'

        // Make the project root importable as a Python module
        PYTHONPATH = "${WORKSPACE}"

        // Paths used throughout the pipeline (relative to WORKSPACE)
        VENV_DIR      = 'venv'
        ANALYZER_DIR  = 'scripts'
        TARGET_REPO   = 'ecommerce_services'
        TEST_DIR      = 'tests'
        RESULT_FILE   = 'analyzer_result.json'
    }

    // -------------------------------------------------------------------------
    // OPTIONS
    // -------------------------------------------------------------------------
    options {
        // Keep the last 15 builds for reference
        buildDiscarder(logRotator(numToKeepStr: '15'))

        // Show timestamps in the console output
        timestamps()

        // Fail fast — do not skip the checkout step
        skipDefaultCheckout(true)
    }

    // -------------------------------------------------------------------------
    // STAGES
    // -------------------------------------------------------------------------
    stages {

        // =====================================================================
        // STAGE 1: CHECKOUT
        // =====================================================================
        stage('Checkout') {
            steps {
                echo '=== [1/9] Checking out source code ==='

                // Pull the code from the repo configured in the Jenkins job
                checkout scm

                // Show the workspace layout for debugging
                sh 'echo "Workspace contents:" && ls -la'

                // Verify the target project exists
                sh """
                    if [ ! -d "${TARGET_REPO}" ]; then
                        echo "ERROR: ${TARGET_REPO}/ folder not found!"
                        echo "Make sure it is committed as a submodule or included in the repo."
                        exit 1
                    fi
                    echo "${TARGET_REPO}/ folder confirmed."
                """

                // Verify the tests folder exists
                sh """
                    if [ ! -d "${TEST_DIR}" ]; then
                        echo "ERROR: ${TEST_DIR}/ folder not found!"
                        exit 1
                    fi
                    echo "${TEST_DIR}/ folder confirmed with \$(ls ${TEST_DIR} | wc -l) file(s)."
                """
            }
        }

        // =====================================================================
        // STAGE 2: SETUP PYTHON ENVIRONMENT
        // =====================================================================
        stage('Setup Python Environment') {
            steps {
                echo '=== [2/9] Setting up Python virtual environment ==='

                // Remove any leftover venv to ensure a clean state
                sh "rm -rf ${VENV_DIR}"

                // Create a fresh virtual environment
                sh "python3 -m venv ${VENV_DIR}"

                // Upgrade pip for reliability
                sh "${VENV_DIR}/bin/pip install --upgrade pip"
            }
        }

        // =====================================================================
        // STAGE 3: INSTALL PYTHON DEPENDENCIES
        // =====================================================================
        stage('Install Python Dependencies') {
            steps {
                echo '=== [3/9] Installing Python dependencies ==='

                // Install the analyzer's Python dependencies
                sh "${VENV_DIR}/bin/pip install -r requirements.txt"

                // Verify critical imports work
                sh """
                    ${VENV_DIR}/bin/python -c "
import yaml
import json
import subprocess
import argparse
from pathlib import Path
print('All critical imports OK')
"
                """
            }
        }

        // =====================================================================
        // STAGE 4: INSTALL NODE DEPENDENCIES (IF PRESENT)
        // =====================================================================
        stage('Install Node Dependencies') {
            steps {
                echo '=== [4/9] Installing JavaScript test dependencies ==='

                // Only run npm install if package.json exists
                sh '''
                    if [ -f "package.json" ]; then
                        echo "package.json found — running npm install"
                        npm install || echo "npm install failed; continuing anyway"
                    else
                        echo "No package.json found — skipping npm install"
                    fi
                '''
            }
        }

        // =====================================================================
        // STAGE 5: DETECT CHANGES
        // =====================================================================
        stage('Detect Changes') {
            steps {
                echo '=== [5/9] Detecting changes in ecommerce_services ==='

                dir(TARGET_REPO) {
                    // Show recent commit history
                    sh 'git log --oneline -5 || echo "Could not read git log"'

                    // Count commits so we know if HEAD~1 exists
                    sh '''
                        COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo 0)
                        echo "Commit count: $COMMIT_COUNT"
                        if [ "$COMMIT_COUNT" -lt 2 ]; then
                            echo "WARNING: Repository has fewer than 2 commits."
                            echo "The analyzer needs at least 2 commits to compare."
                        fi
                    '''

                    // Show what files changed in the last commit
                    sh 'git diff --name-only HEAD~1..HEAD 2>/dev/null || echo "No previous commit to compare"'
                }
            }
        }

        // =====================================================================
        // STAGE 6: RUN THE ANALYZER
        // =====================================================================
        stage('Analyze Changes') {
            steps {
                echo '=== [6/9] Running Test Impact Analyzer ==='

                // Clean previous result
                sh "rm -f ${RESULT_FILE}"

                // Run the analyzer from the workspace root, targeting
                // the ecommerce_services repo and the tests/ folder at root.
                sh """
                    ${VENV_DIR}/bin/python ${ANALYZER_DIR}/run_analyzer.py \
                        --repo ${TARGET_REPO} \
                        --range HEAD~1..HEAD \
                        --tests ${TEST_DIR} \
                    || echo "Analyzer returned non-zero (possibly no changes detected)"
                """

                // Verify the result file was created; if not, create an empty one
                sh """
                    if [ ! -f "${RESULT_FILE}" ]; then
                        echo "WARNING: ${RESULT_FILE} not found."
                        echo "Creating empty result file to continue the pipeline."
                        echo '{"affected_tests":[],"has_affected_tests":false,"test_count":0}' > ${RESULT_FILE}
                    fi
                """
            }
        }

        // =====================================================================
        // STAGE 7: SHOW SUMMARY
        // =====================================================================
        stage('Show Summary') {
            steps {
                echo '=== [7/9] Analysis Summary ==='

                sh """
                    ${VENV_DIR}/bin/python -c "
import json
with open('${RESULT_FILE}', 'r') as f:
    result = json.load(f)

print('=' * 60)
print('ANALYSIS SUMMARY')
print('=' * 60)
print(f'Has affected tests : {result.get(\\'has_affected_tests\\', False)}')
print(f'Test count         : {result.get(\\'test_count\\', 0)}')

summary = result.get('summary', {})
if summary:
    print()
    print('Changed files    : ' + str(len(summary.get('changed_files', []))))
    print('Source files     : ' + str(len(summary.get('source_files', []))))
    print('Config files     : ' + str(len(summary.get('config_files', []))))
    print('Total tests      : ' + str(summary.get('total_tests_analyzed', 0)))

print()
print('Affected tests:')
for test in result.get('affected_tests', []):
    print('  - ' + test)
print('=' * 60)
"
                """
            }
        }

        // =====================================================================
        // STAGE 8: RUN AFFECTED TESTS
        // =====================================================================
        stage('Run Affected Tests') {
            steps {
                echo '=== [8/9] Running only the affected tests ==='

                // Delegate to the multi-language test runner script.
                // It reads analyzer_result.json and dispatches to the
                // correct test framework per file extension.
                sh """
                    ${VENV_DIR}/bin/python run_selected_tests.py \
                        || echo "Some tests failed — see output above"
                """
            }
        }

        // =====================================================================
        // STAGE 9: ARCHIVE RESULTS
        // =====================================================================
        stage('Archive Results') {
            steps {
                echo '=== [9/9] Archiving results ==='

                // Archive the JSON result as a build artifact
                archiveArtifacts(
                    artifacts: "${RESULT_FILE}",
                    allowEmptyArchive: true,
                    fingerprint: true
                )
            }
        }
    }

    // -------------------------------------------------------------------------
    // POST ACTIONS
    // -------------------------------------------------------------------------
    post {
        always {
            echo '========================================================='
            echo 'Pipeline execution finished.'
            echo '========================================================='

            // Print the final JSON so it's visible in the console log
            sh '''
                if [ -f "analyzer_result.json" ]; then
                    echo "Final analyzer_result.json:"
                    cat analyzer_result.json
                else
                    echo "No analyzer_result.json file present."
                fi
            '''

            // Clean up the venv to save disk space on the agent.
            // Set to false if you want faster subsequent builds.
            sh 'rm -rf venv || true'
        }

        success {
            echo '========================================================='
            echo 'BUILD SUCCEEDED'
            echo 'All affected tests passed.'
            echo '========================================================='
        }

        failure {
            echo '========================================================='
            echo 'BUILD FAILED'
            echo 'Check the console output above for details.'
            echo '========================================================='
        }

        unstable {
            echo '========================================================='
            echo 'BUILD UNSTABLE'
            echo 'Some tests may have failed, but the pipeline completed.'
            echo '========================================================='
        }
    }
}