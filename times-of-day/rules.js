/**
 * openHAB ECMAScript (262 Edition 11) jsrule example
 *
 * Keep IsDay/IsNight item switch and items with times of next sunrise and
 * sunset events up to date.
 *
 */

rules.JSRule({
    name: "times-of-day",
    description: "Set day/night switch and times of next sunrise/sunset event",
    triggers: [
        triggers.ChannelEventTrigger("astro:sun:local:rise#event", "START"),
        triggers.ChannelEventTrigger("astro:sun:local:set#event", "START")
    ],
    execute: data => {

        let ZonedDateTime = Java.type("java.time.ZonedDateTime");
        let tomorrow = ZonedDateTime.now().plusDays(1);

        if (data.triggerType === "ChannelEventTrigger" && data.itemName === "astro:sun:local:rise#event") {

            items.getItem("IsDay").sendCommand("ON");
            items.getItem("IsNight").sendCommand("OFF");

            let sun_action = actions.get("astro", "astro:sun:local");
            let sun_rise_tomorrow = sun_action.getEventTime("SUN_RISE", tomorrow, "START");
            items.getItem("NextSunRise").sendCommand(sun_rise_tomorrow.toLocalDateTime().toString());

        } else if (data.triggerType === "ChannelEventTrigger" && data.itemName === "astro:sun:local:set#event") {

            items.getItem("IsDay").sendCommand("OFF");
            items.getItem("IsNight").sendCommand("ON");

            let sun_action = actions.get("astro", "astro:sun:local");
            let sun_set_tomorrow = sun_action.getEventTime("SUN_SET", tomorrow, "START");
            items.getItem("NextSunSet").sendCommand(sun_set_tomorrow.toLocalDateTime().toString());

        }

    }

});
