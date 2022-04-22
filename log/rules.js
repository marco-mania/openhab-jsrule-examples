/**
 * openHAB ECMAScript (262 Edition 11) jsrule example
 *
 * Write events (here motion events of members of an item group representing
 * motion detectors) to a log file.
 * In this example a location string is stored as item metadata.
 *
 */

rules.JSRule({
    name: "log-motion",
    description: "Log motion",
    triggers: [
        triggers.GroupStateChangeTrigger("MotionsDetectors", "ON")
    ],
    execute: data => {

        let Duration = Java.type('java.time.Duration');

        const now = new Date();

        actions.Exec.executeCommandLine(Duration.ofSeconds(5), "bash", "-c", "echo \"["+now.toLocaleString()+"] Motion detected "+items.getItem(data.itemName).getMetadataValue("Location")+"."+"\" >> /openhab/conf/custom_logs/motion.log");

    }
});
