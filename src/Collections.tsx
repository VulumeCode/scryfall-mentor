import React from 'react';
import { useRef } from 'react';

import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider, TreeRef, TreeItemIndex, TreeItem } from 'react-complex-tree';
import "react-complex-tree/lib/style.css";


import icons from './icons'

const Collections: React.FC<{ treeData: Record<TreeItemIndex, TreeItem<string>>, onSelectQuery: (queryKey: number) => void }> = ({ treeData, onSelectQuery }) => {

    const tree = useRef<TreeRef>(null);

    return (
        <>
            <span style={{ display: 'flex' }}>
                <button className='blueprint-icons-big button-n inverted'  >{icons['folder-new'].utf}</button>
                <input
                    className='button-n inverted collections-filter'
                    type={'search'}
                    placeholder={icons['filter-list'].utf} />
            </span>

            <UncontrolledTreeEnvironment
                dataProvider={new StaticTreeDataProvider(treeData, (item, data) => ({ ...item, data }))}
                getItemTitle={item => item.data}
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
                    treeId="tree-1"
                    rootItem="root"
                    treeLabel="Tree Example"
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