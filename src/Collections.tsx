import React from "react"
import { useRef } from "react"

import {
    ControlledTreeEnvironment,
    Tree,
    TreeRef,
    TreeItemIndex,
    TreeItem,
    TreeEnvironmentRef,
    TreeItemRenderContext,
} from "react-complex-tree"
import "react-complex-tree/lib/style.css"

import icons from "./icons"

export type TreeItemData = {
    title: string,
    queryId: number | null,
}

export type TreeData = Record<TreeItemIndex, TreeItem<TreeItemData>>

const Collections: React.FC<{
    treeData: TreeData,
    onSelectQuery: (queryKey: number) => void,
    // onAddCollection: () => string,
}> = ({ treeData, onSelectQuery }) => {
    const tree = useRef<TreeRef>(null)
    const environment = useRef<TreeEnvironmentRef>(null)

    // const dataProvider = new StaticTreeDataProvider(
    //     treeData,
    //     (item, newName) => ({
    //         ...item,
    //         data: { ...item.data, title: newName },
    //     }),
    // );

    // console.log(treeData);
    // console.dir({ render: dataProvider.data.items })

    return (
        <>
            {/* <span style={{ display: "flex", width: "100%" }}>
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
            </span> */}

            <ControlledTreeEnvironment
                ref={environment}
                items={treeData}
                getItemTitle={(item: TreeItem<TreeItemData>): string => item.data.title}
                viewState={{}}
                canReorderItems
                canDragAndDrop
                onFocusItem={(item: TreeItem<TreeItemData>): void => {
                    if (!item.hasChildren) {
                        onSelectQuery(item.data.queryId as number)
                    }
                }}
            >
                <Tree
                    treeId="Collections"
                    rootItem="root"
                    ref={tree}
                    renderItemArrow={({
                        item,
                        context,
                    }: {
                        item: TreeItem<TreeItemData>,
                        context: TreeItemRenderContext<never>,
                    }) =>
                        item.hasChildren ? (
                            <span
                                className="blueprint-icons"
                                onClick={() => tree.current?.toggleItemExpandedState(item.index)}
                            >
                                {" "}
                                {context.isExpanded
                                    ? icons["folder-open"].utf
                                    : icons["folder-close"].utf}
                            </span>
                        ) : null
                    }
                    renderItemTitle={({ item }) => (
                        <div onDoubleClick={() => tree.current?.startRenamingItem(item.index)}>{item.data.title}</div>
                    )}
                />
            </ControlledTreeEnvironment>
        </>
    )
}

export default Collections
