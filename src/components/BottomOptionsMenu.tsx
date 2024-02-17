import { Affix, rem, Button, Menu, Text } from "@mantine/core";
import { IconFolder, IconArrowMoveUp, IconArrowsShuffle, IconArrowsSort, IconCalendar, IconSortAZ, IconSortZA } from "@tabler/icons-react";
import { AVAILABLE_SORTS } from "../pages/HomePage/useHandleDirectorySelection";

interface BottomOptionsMenuProps {
    isOpened: boolean,
    onOpenedChange: (opened: boolean) => void,
    isLoading: boolean,
    handleSelectDirectory: () => void,
    scrollToTop: () => void,
    handleShuffle: () => void
    handleSortByDate: (isDecreasing: boolean) => void
    currentSort: typeof AVAILABLE_SORTS[keyof typeof AVAILABLE_SORTS]
    handleSortByName: (isDecreasing: boolean) => void
    handleSortBySize: (isDecreasing: boolean) => void
}

export default function BottomOptionsMenu({ isOpened, onOpenedChange, isLoading, handleSelectDirectory, scrollToTop, handleShuffle, handleSortByDate, currentSort, handleSortByName, handleSortBySize }: BottomOptionsMenuProps) {
    return (
        <Affix position={{ bottom: rem(20), right: rem(20) }}>
            <Menu shadow="md" width={200} trigger="hover" opened={isOpened} onChange={onOpenedChange}>
                <Menu.Target>
                    <Button loading={isLoading} disabled={isLoading}>
                        Menu
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item
                        icon={<IconFolder size={14} />}
                        onClick={handleSelectDirectory}
                    >
                        Select Directory
                    </Menu.Item>
                    <Menu.Item
                        icon={<IconArrowMoveUp size={14} />}
                        onClick={scrollToTop}
                    >
                        Scroll to Top
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Sort</Menu.Label>
                    <Menu.Item
                        icon={<IconArrowsShuffle size={14} />}
                        onClick={handleShuffle}
                    >
                        Shuffle
                    </Menu.Item>
                    <Menu trigger="hover" position="left" withArrow>
                        <Menu.Target>
                            <Menu.Item icon={<IconArrowsSort size={14} />}>Sort By</Menu.Item>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                icon={<IconCalendar size={14} />}
                                onClick={() => handleSortByDate(false)}
                            >
                                <Text fw={currentSort === AVAILABLE_SORTS.DATE_INCREASING ? 500 : 400}>Sort by Date (Increasing)</Text>
                            </Menu.Item>
                            <Menu.Item
                                icon={<IconCalendar size={14} />}
                                onClick={() => handleSortByDate(true)}
                            >
                                <Text fw={currentSort === AVAILABLE_SORTS.DATE_DECREASING ? 500 : 400}>Sort by Date (Decreasing)</Text>
                            </Menu.Item>
                            <Menu.Item
                                icon={<IconSortAZ size={14} />}
                                onClick={() => handleSortByName(false)}
                            >
                                <Text fw={currentSort === AVAILABLE_SORTS.NAME_INCREASING ? 500 : 400}>Sort by Name (Increasing)</Text>
                            </Menu.Item>
                            <Menu.Item
                                icon={<IconSortZA size={14} />}
                                onClick={() => handleSortByName(true)}
                            >
                                <Text fw={currentSort === AVAILABLE_SORTS.NAME_DECREASING ? 500 : 400}>Sort by Name (Decreasing)</Text>
                            </Menu.Item>
                            <Menu.Item
                                icon={<IconSortZA size={14} />}
                                onClick={() => handleSortBySize(false)}
                            >
                                <Text fw={currentSort === AVAILABLE_SORTS.SIZE_INCREASING ? 500 : 400}>Sort by Size (Increasing)</Text>
                            </Menu.Item>
                            <Menu.Item
                                icon={<IconSortZA size={14} />}
                                onClick={() => handleSortBySize(true)}
                            >
                                <Text fw={currentSort === AVAILABLE_SORTS.SIZE_DECREASING ? 500 : 400}>Sort by Size (Decreasing)</Text>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Menu.Dropdown>
            </Menu>
        </Affix>
    )
}