import { TreeItem, TreeItemActions, TreeItemRenderFlags } from "react-complex-tree";
import { HTMLProps } from "react";

// https://github.com/lukasbach/react-complex-tree/tree/main/packages/core/src/interactionMode

export const customInteraction = (item: TreeItem, treeId: string, actions: TreeItemActions, _renderFlags: TreeItemRenderFlags): HTMLProps<HTMLElement> => ({
    onClick: (_e) => {
        actions.focusItem();
        actions.selectItem();
    },
    onFocus: () => {
        /*NOOP*/
    },
    // onDoubleClick: () => {
    //     console.log("actions.startRenamingItem");
    //     actions.startRenamingItem();
    // },
});

// import { HTMLProps } from "react";
// import { InteractionManager, TreeEnvironmentContextProps, TreeItem, TreeItemActions, TreeItemRenderFlags } from "react-complex-tree";

// export class CustomInteractionManager implements InteractionManager {
//     private environment: TreeEnvironmentContextProps;
//     public readonly mode = "custom";

//     constructor(environment: TreeEnvironmentContextProps) {
//         this.environment = environment;
//     }

//     createInteractiveElementProps(item: TreeItem, treeId: string, actions: TreeItemActions, renderFlags: TreeItemRenderFlags): HTMLProps<HTMLElement> {
//         return {
//             onClick: (e) => {
//                 actions.focusItem();
//                 if (e.shiftKey) {
//                     actions.selectUpTo();
//                 } else if (e.ctrlKey) {
//                     if (renderFlags.isSelected) {
//                         actions.unselectItem();
//                     } else {
//                         actions.addToSelectedItems();
//                     }
//                 } else {
//                     actions.selectItem();
//                     if (!item.hasChildren || this.environment.canInvokePrimaryActionOnItemContainer) {
//                         actions.primaryAction();
//                     }
//                 }
//             },
//             onFocus: () => {
//                 actions.focusItem();
//             },
//             onDragStart: (e) => {
//                 e.dataTransfer.dropEffect = "move"; // TODO
//                 // e.dataTransfer.setDragImage(environment.renderDraggingItem(viewState.selectedItems), 0, 0);
//                 actions.startDragging();
//             },
//             onDragOver: (e) => {
//                 e.preventDefault(); // Allow drop
//             },
//             draggable: renderFlags.canDrag && !renderFlags.isRenaming,
//             tabIndex: !renderFlags.isRenaming ? (renderFlags.isFocused ? 0 : -1) : undefined,
//         };
//     }
// }
