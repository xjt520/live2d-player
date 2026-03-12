import { ResourceModel, RESOURCE_TYPE } from "@/lib/protocol";
import { useBackgroundStore, useCharacterStore } from "@/lib/store";
import { useLive2D } from "./live2d";
import * as CONSTANTS from '@/lib/constants';

export function useAppConfig() {
    const { background, setBackground } = useBackgroundStore();
    const { character, setCharacter } = useCharacterStore();
    const { setLive2dCharacter } = useLive2D();

    const setCurrentCharacter = (char: ResourceModel | null) => {
        if (char == null) {
            const model = CONSTANTS.SENTIO_CHARACTER_DEFAULT;
            const path = CONSTANTS.SENTIO_CHARACTER_FREE_PATH;
            const defaultCharacter: ResourceModel = {
                resource_id: "FREE_HaruGreeter",
                name: model,
                link: `/${CONSTANTS.SENTIO_CHARACTER_DEFAULT_PORTRAIT}`,
                type: RESOURCE_TYPE.CHARACTER,
            };
            setCharacter(defaultCharacter);
            setLive2dCharacter(defaultCharacter);
        } else {
            setCharacter(char);
            setLive2dCharacter(char);
        }
    };

    const initApp = () => {
        setCurrentCharacter(null);
    };

    return {
        background,
        setBackground,
        character,
        setCurrentCharacter,
        initApp,
    };
}
