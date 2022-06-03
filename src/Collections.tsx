import React from "react";
import { useRef } from "react";

import {
    ControlledTreeEnvironment,
    StaticTreeDataProvider,
    Tree,
    TreeRef,
    TreeItemIndex,
    TreeItem,
    UncontrolledTreeEnvironment,
    TreeEnvironmentRef,
} from "react-complex-tree";
import "react-complex-tree/lib/style.css";

import icons from "./icons";

type TreeData = {
    title: string;
    queryId: number | null;
};

const Collections: React.FC<{
    treeData: Record<TreeItemIndex, TreeItem<TreeData>>;
    onSelectQuery: (queryKey: number) => void;
    onAddCollection: () => string;
}> = ({ treeData, onSelectQuery, onAddCollection }) => {
    const tree = useRef<TreeRef>(null);
    const environment = useRef<TreeEnvironmentRef>(null);

    const dataProvider = new StaticTreeDataProvider(
        treeData,
        (item, newName) => ({
            ...item,
            data: { ...item.data, title: newName },
        }),
    );

    // console.log(treeData);
    // console.dir({ render: dataProvider.data.items })

    (window as any).tree = tree;
    return (
        <>
            <span style={{ display: "flex", width: "100%" }}>
                <button
                    className="blueprint-icons-big button-n inverted"
                    onClick={async () => {
                        const newIndex = onAddCollection();
                        environment.current!.items = treeData;
                        await dataProvider.onChangeItemChildren("root", [
                            ...treeData.root.children!,
                            newIndex,
                        ]);
                        // await dataProvider.onChangeItemChildren(newIndex, [])
                        // console.dir({ click: dataProvider.data.items })
                        console.dir(await dataProvider.getTreeItem(newIndex));
                        // tree.current?.startRenamingItem("Drinks")
                    }}
                >
                    {icons["folder-new"].utf}
                </button>
                <input
                    className="button-n inverted collections-filter"
                    style={{ width: "100%" }}
                    type={"search"}
                    placeholder={icons["filter-list"].utf + "doesn't work "}
                />
            </span>

            <UncontrolledTreeEnvironment
                ref={environment}
                dataProvider={dataProvider}
                getItemTitle={(item) => item.data.title}
                viewState={{}}
                canReorderItems
                canDragAndDrop
                onFocusItem={(item) => {
                    if (!item.hasChildren) {
                        onSelectQuery(item.data.queryId as number);
                    }
                }}
            >
                <Tree
                    treeId="Collections"
                    rootItem="root"
                    ref={tree}
                    renderItemArrow={(props) =>
                        props.item.hasChildren ? (
                            <span
                                className="blueprint-icons"
                                onClick={() =>
                                    tree.current?.toggleItemExpandedState(
                                        props.item.index,
                                    )
                                }
                            >
                                {" "}
                                {props.context.isExpanded
                                    ? icons["folder-open"].utf
                                    : icons["folder-close"].utf}
                            </span>
                        ) : null
                    }
                    renderItemTitle={({ item }) => (
                        <div
                            onDoubleClick={() =>
                                tree.current?.startRenamingItem(item.index)
                            }
                        >
                            {item.data.title}
                        </div>
                    )}
                />
            </UncontrolledTreeEnvironment>
        </>
    );
};

export default Collections;
