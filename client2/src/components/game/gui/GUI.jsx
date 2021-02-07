import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import Meters from "./meters/Meters";
import "./GUI.scss";
import GloryCounter from "./glory_counter/GloryCounter";
import DefenceCounter from "./defence_counter/DefenceCounter";
import PanelButton from "./panel_button/PanelButton";
import StatsPanel from "./panels/stats/StatsPanel";
import TasksPanel from "./panels/tasks/TasksPanel";
import CreateAccountPanel from "./panels/create_account/CreateAccountPanel";
import TaskTracker from "./task_tracker/TaskTracker";
import Utils from "../../../shared/Utils";
import AccountPanel from "./panels/account/AccountPanel";
import { ApplicationState } from "../../../shared/state/States";
import statsIcon from "../../../assets/images/gui/hud/stats-icon.png";
import tasksIcon from "../../../assets/images/gui/hud/tasks-icon.png";
import exitIcon from "../../../assets/images/gui/hud/exit-icon.png";
import discordIcon from "../../../assets/images/gui/hud/notdiscord-icon.png";
import wikiIcon from "../../../assets/images/gui/hud/notwiki-icon.png";
import inventoryIcon from "../../../assets/images/gui/hud/inventory-icon.png";
import settingsIcon from "../../../assets/images/gui/hud/settings-icon.png";
import {
    DUNGEON_PORTAL_PRESSED, HITPOINTS_VALUE, LOGGED_IN, POSITION_VALUE,
} from "../../../shared/EventTypes";
import ChatInput from "./chat_input/ChatInput";
import DungeonPanel from "./panels/dungeon/DungeonPanel";
import RespawnPanel from "./panels/respawn/RespawnPanel";

const Panels = {
    NONE: Symbol("NONE"),
    CreateAccount: Symbol("CreateAccount"),
    Account: Symbol("Account"),
    Respawn: Symbol("Respawn"),
    Dungeon: Symbol("Dungeon"),
    Stats: Symbol("Stats"),
    Tasks: Symbol("Tasks"),
};

function GUI() {
    const [shownPanel, setShownPanel] = useState(null);
    const [trackedTask, setTrackedTask] = useState(null);
    const [loggedIn, setLoggedIn] = useState(ApplicationState.loggedIn);
    const [targetDungeonPortal, setTargetDungeonPortal] = useState(null);
    const discordInviteLink = "https://discord.com/invite/7wjyU7B";
    const wikiLink = "https://dungeonz.fandom.com/wiki/Dungeonz.io_Wiki";

    const closePanelCallback = () => {
        setShownPanel(Panels.NONE);
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(LOGGED_IN, (msg, data) => {
                setLoggedIn(data.new);
            }),
            PubSub.subscribe(DUNGEON_PORTAL_PRESSED, (msg, portal) => {
                // Set the target portal before changing the
                // panel, or it won't know what info to load.
                setTargetDungeonPortal(portal);
                setShownPanel(Panels.Dungeon);
            }),
            PubSub.subscribe(POSITION_VALUE, () => {
                setShownPanel(Panels.NONE);
            }),
            PubSub.subscribe(HITPOINTS_VALUE, (msg, data) => {
                // If the player died, show the respawn panel.
                if (data.new <= 0) {
                    setShownPanel(Panels.Respawn);
                }
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    useEffect(() => {
        // If there were looking at the create account
        // panel, switch to the account panel.
        if (shownPanel === Panels.CreateAccount) {
            setShownPanel(Panels.Account);
        }
    }, [loggedIn]);

    return (
        <div className="gui">
            <Meters />

            {trackedTask && <TaskTracker />}

            <div className="top-left-corner-cont gui-zoomable">
                <GloryCounter />
                <DefenceCounter />
                <PanelButton
                  icon={statsIcon}
                  onClick={() => {
                      setShownPanel(Panels.Stats);
                  }}
                  tooltip={Utils.getTextDef("Avatar tooltip")}
                />
                <PanelButton
                  icon={tasksIcon}
                  onClick={() => {
                      setShownPanel(Panels.Tasks);
                  }}
                  tooltip={Utils.getTextDef("Tasks tooltip")}
                />
            </div>

            <div className="top-right-corner-cont gui-zoomable">
                <PanelButton
                  icon={exitIcon}
                  onClick={() => {
                      if (loggedIn) {
                          setShownPanel(Panels.Account);
                      }
                      else {
                          setShownPanel(Panels.CreateAccount);
                      }
                  }}
                  tooltip={Utils.getTextDef("Exit tooltip")}
                />

                <PanelButton
                  icon={discordIcon}
                  onClick={() => window.open(discordInviteLink, "_blank")}
                  tooltip={Utils.getTextDef("Discord tooltip")}
                />

                <PanelButton
                  icon={wikiIcon}
                  onClick={() => window.open(wikiLink, "_blank")}
                  tooltip={Utils.getTextDef("Wikia tooltip")}
                />
            </div>

            <div className="bottom-right-corner-cont gui-zoomable">
                <PanelButton
                  icon={inventoryIcon}
                  onClick={() => null} // @TODO implement this later
                  tooltip={Utils.getTextDef("Inventory tooltip")}
                />

                <PanelButton
                  icon={settingsIcon}
                  onClick={() => null} // @TODO implement this later
                  tooltip={Utils.getTextDef("Settings tooltip")}
                />
            </div>

            <div className="panel-cont">
                {shownPanel === Panels.CreateAccount && (
                <CreateAccountPanel
                  onCloseCallback={closePanelCallback}
                />
                )}
                {shownPanel === Panels.Account && (
                <AccountPanel
                  onCloseCallback={closePanelCallback}
                />
                )}
                {shownPanel === Panels.Respawn && (
                <RespawnPanel />
                )}
                {shownPanel === Panels.Dungeon && (
                <DungeonPanel
                  onCloseCallback={closePanelCallback}
                  dungeonPortal={targetDungeonPortal}
                />
                )}
                {shownPanel === Panels.Stats && (
                <StatsPanel
                  onCloseCallback={closePanelCallback}
                />
                )}
                {shownPanel === Panels.Tasks && (
                <TasksPanel
                  onCloseCallback={closePanelCallback}
                />
                )}
            </div>

            <ChatInput />
        </div>
    );
}

export default GUI;
