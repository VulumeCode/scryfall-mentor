import React from 'react';
import { useRef } from 'react';

import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider, TreeRef, TreeItemIndex, TreeItem } from 'react-complex-tree';
import "react-complex-tree/lib/style.css";


const Collections: React.FC<{ treeData: Record<TreeItemIndex, TreeItem<string>>, onSelectQuery: (queryKey: string) => void }> = ({ treeData, onSelectQuery }) => {

    const tree = useRef<TreeRef>(null);

    return (
        <UncontrolledTreeEnvironment
            dataProvider={new StaticTreeDataProvider(treeData, (item, data) => ({ ...item, data }))}
            getItemTitle={item => item.data}
            viewState={{}}
            canReorderItems
            canDragAndDrop
            onFocusItem={(item) => {
                if (!item.hasChildren) {
                    onSelectQuery(item.index as string)
                }
            }}
        >
            <Tree
                treeId="tree-1"
                rootItem="root"
                treeLabel="Tree Example"
                ref={tree}
                renderItemArrow={(props) => props.item.hasChildren
                    ? <span className='blueprint-icons-standard' onClick={() => tree.current?.toggleItemExpandedState(props.item.index)}> {props.context.isExpanded
                        ? "\uF1BA"
                        : "\uF1B8"}</span>
                    : null}
                renderItemTitle={({ title, item }) => <div onDoubleClick={() => tree.current?.startRenamingItem(item.index)}>{title}</div>}
            />
        </UncontrolledTreeEnvironment>
    );
};

export default Collections;