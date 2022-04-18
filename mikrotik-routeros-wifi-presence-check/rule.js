/**
 * openHAB ECMAScript (262 Edition 11) jsrule example
 *
 * Retrieves list of connected wifi devices and searches for MAC addresses. If
 * you do this for residents smartphones, you can assume, that persons are at
 * home or not. An openHAB switch item will be set to ON or OFF.
 *
 * If you use an openHAB docker container you need to place the secret key and a
 * ssh binary in the containers volume, e.g. in
 * "/path/to/docker/volume/openhab/conf/custom_bin".
 *
 */

rules.JSRule({
    name: "mikrotik-routeros-wifi-presence-check",
    description: "Check if device is connected to wifi",
    triggers: [
        triggers.GenericCronTrigger("0 0/2 * * * ? *") //every 2 minutes
    ],
    execute: data => {

        let Duration = Java.type('java.time.Duration');

        function p_search_for_macs(mikrotik_wifi_mac_list) {

            let device = mikrotik_wifi_mac_list.find(line => line.match("F3:BB:17:1D:2E:C6"));
            if (device !== undefined) {
                items.getItem("JohnAtHome").sendCommandIfDifferent("ON");
            } else {
                items.getItem("JohnAtHome").sendCommandIfDifferent("OFF");
            }

            let device = mikrotik_wifi_mac_list.find(line => line.match("4B:46:DD:34:54:5C"));
            if (device !== undefined) {
                items.getItem("JaneAtHome").sendCommandIfDifferent("ON");
            } else {
                items.getItem("JaneAtHome").sendCommandIfDifferent("OFF");
            }

        }

        let response = actions.Exec.executeCommandLine(Duration.ofSeconds(5), "ssh", "-o", "StrictHostKeyChecking=no", "-i", "/path/to/sshkey", "openhab@my-mikrotik-hostname", "/caps-man registration-table print").split('\n');

        setTimeout(p_search_for_macs, 6000, response);

    }
});
