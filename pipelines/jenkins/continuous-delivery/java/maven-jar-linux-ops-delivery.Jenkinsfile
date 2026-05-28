properties([
    parameters([
        choice(
            name: 'action',
            choices: 'start\nstop\nupcode\nrollback',
            description: 'Choose the delivery action to run'
        ),
        string(
            name: 'server',
            defaultValue: 'lab-server',
            description: 'Jenkins node name used to run this job'
        ),
        string(
            name: 'hash',
            defaultValue: '',
            description: 'Git branch, tag, or commit used for the upcode action'
        ),
        string(
            name: 'rollback_version',
            defaultValue: '',
            description: 'Backup zip file used for the rollback action'
        )
    ])
])

appUser = "shoeshop"
appName = "shoe-ShoppingCart"
appVersion = "0.0.1-SNAPSHOT"
appType = "jar"
processName = "${appName}-${appVersion}.${appType}"
folderDeploy = "/datas/${appUser}/run"
folderBackup = "/datas/${appUser}/backups"
folderMain = "/datas/${appUser}"
buildScript = "mvn clean install -DskipTests=true"
copyScript = "sudo cp target/${processName} ${folderDeploy}"
permsScript = "sudo chown -R ${appUser}. ${folderDeploy}"
killScript = "pids=\$(ps -ef | grep ${processName} | grep -v grep | awk '{print \$2}'); [ -n \"\$pids\" ] && sudo kill -9 \$pids || true"
runScript = "sudo su ${appUser} -c 'cd ${folderDeploy}; java -jar ${processName} > nohup.out 2>&1 &'"
gitLink = "http://git.h1eudayne.tech/shoeshop/shoeshop.git"

def getProcessId(processName) {
    return sh(
        returnStdout: true,
        script: """ps -ef | grep ${processName} | grep -v grep | awk '{print \$2}'""",
        label: "get process id"
    ).trim()
}

def startProcess() {
    stage('start') {
        sh(script: """ ${runScript} """, label: "run the project")
        sleep 5
        def processId = getProcessId("${processName}")
        if (processId == "") {
            error("Cannot start process")
        }
    }
    echo("${appName} with server ${params.server} started")
}

def stopProcess() {
    stage('stop') {
        def processId = getProcessId("${processName}")
        if (processId != "") {
            sh(script: """ ${killScript} """, label: "kill process")
        }
        echo("${appName} with server ${params.server} stopped")
    }
}

def upcodeProcess() {
    stage('checkout') {
        if (params.hash.trim() == "") {
            error("Require a Git hash, branch, or tag for code update.")
        }
        checkout([
            $class: 'GitSCM',
            branches: [[name: params.hash.trim()]],
            userRemoteConfigs: [[
                credentialsId: 'jenkins-gitlab-user-account',
                url: gitLink
            ]]
        ])
    }
    stage('build') {
        sh(script: """ ${buildScript} """, label: "build with maven")
    }
    stage('config') {
        sh(script: """ ${copyScript} """, label: "copy .jar file into the deploy folder")
        sh(script: """ ${permsScript} """, label: "assign project permissions")
    }
}

def backupProcess() {
    stage('backup') {
        def timeStamp = new Date().format("ddMMyyyy_HHmm")
        def zipFileName = "${appName}_${timeStamp}.zip"
        sh(
            script: """ sudo su ${appUser} -c "cd ${folderMain}; zip -jr ${folderBackup}/${zipFileName} ${folderDeploy}" """,
            label: "backup old version"
        )
    }
}

def rollbackProcess() {
    stage('rollback') {
        if (params.rollback_version.trim() == "") {
            error("Require a backup zip file for rollback.")
        }
        sh(
            script: """ sudo su ${appUser} -c "cd ${folderDeploy}; rm -rf *" """,
            label: "delete the current version"
        )
        sh(
            script: """ sudo su ${appUser} -c "cd ${folderBackup}; unzip ${params.rollback_version.trim()} -d ${folderDeploy}" """,
            label: "rollback process"
        )
    }
}

node(params.server) {
    currentBuild.displayName = params.action

    switch (params.action) {
        case "start":
            startProcess()
            break
        case "stop":
            stopProcess()
            break
        case "upcode":
            currentBuild.description = "server ${params.server} with hash ${params.hash}"
            backupProcess()
            stopProcess()
            upcodeProcess()
            startProcess()
            break
        case "rollback":
            currentBuild.description = "server ${params.server} with rollback ${params.rollback_version}"
            stopProcess()
            rollbackProcess()
            startProcess()
            break
        default:
            error("Unsupported action: ${params.action}")
    }
}
