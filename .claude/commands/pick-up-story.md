As the **frontend-developer** subagent do the following in yolo mode:
1. Scan the `stories` folder for all story files.
2. Identify the next story whose dependencies are fully satisfied, based on the project’s dependency graph.
3. Fully implement that story in code.
4. Use playwright mcp to verify story has been implemented .
5. Loop back to 3-4 until it is verified
6. Update the story file’s metadata to set `status: finished`.
7. git commit the story and gh push
8. Repeat steps 1–4 until **no** stories remain in the folder.
