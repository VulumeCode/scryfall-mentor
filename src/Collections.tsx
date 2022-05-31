import React from 'react';
import { useRef } from 'react';

import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider, TreeRef, TreeItemIndex, TreeItem } from 'react-complex-tree';
import "react-complex-tree/lib/style.css";


import icons from './icons'

type TreeData = {
    title: string
    queryId: string
}

const Collections: React.FC<{
    treeData: Record<TreeItemIndex, TreeItem<TreeData>>, onSelectQuery: (queryKey: number) => void,
    onAddCollection: () => void
}> = ({ treeData, onSelectQuery, onAddCollection }) => {

    const tree = useRef<TreeRef>(null);

    console.log(treeData);

    (window as any).tree = tree;
    return (
        <>
            <span style={{ display: 'flex', width: '100%' }}>
                <button className='blueprint-icons-big button-n inverted'
                    onClick={() => onAddCollection()}
                >{icons['folder-new'].utf}</button>
                <input
                    className='button-n inverted collections-filter'
                    style={{ width: '100%' }}
                    type={'search'}
                    placeholder={icons['filter-list'].utf + "doesn't work "} />
            </span>

            <UncontrolledTreeEnvironment
                dataProvider={new StaticTreeDataProvider(treeData, (item, newName) => ({ ...item, data: { ...item.data, title: newName } }))}
                getItemTitle={item => item.data.title}
                viewState={{}}
                canReorderItems
                canDragAndDrop
                onFocusItem={(item) => {
                    if (!item.hasChildren) {
                        onSelectQuery(item.data.queryId as number)
                    }
                }}
            >
                <Tree
                    treeId="Collections"
                    rootItem="root"
                    ref={tree}
                    renderItemArrow={(props) => props.item.hasChildren
                        ? <span
                            className='blueprint-icons'
                            onClick={() => tree.current?.toggleItemExpandedState(props.item.index)}> {props.context.isExpanded
                                ? icons['folder-open'].utf
                                : icons['folder-close'].utf}
                        </span>
                        : null}
                    renderItemTitle={({ item }) => <div onDoubleClick={() => tree.current?.startRenamingItem(item.index)}>{item.data.title}</div>}
                />
            </UncontrolledTreeEnvironment>
        </>
    );
};

export default Collections;