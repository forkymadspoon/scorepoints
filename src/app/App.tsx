import { useLocalStorage } from "./hooks/useLocalStorage";
import { ChildDashboard } from "./components/ChildDashboard";
import type { ChildProfile } from "./types";

export default function App() {
  const [children, setChildren] = useLocalStorage<ChildProfile[]>("app-children-list", [{ id: "default", name: "My Child" }]);
  const [activeChildId, setActiveChildId] = useLocalStorage<string>("app-active-child", "default");

  const activeChild = children.find(c => c.id === activeChildId) || children[0];

  return (
    <ChildDashboard
      key={activeChild.id}
      child={activeChild}
      childrenList={children}
      setChildren={setChildren}
      setActiveChildId={setActiveChildId}
    />
  );
}
