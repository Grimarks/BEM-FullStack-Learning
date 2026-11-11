import { useRef, useState } from "react";
import { useFetch } from "../../hooks/useFetch.js";
import { useForm } from "./useForm.js";
import { moveItem } from "../lib/list.js";

const identity = (x) => x;
export function useCrud(api, empty, { fromApi = identity, toApi = identity } = {}) {
  const list = useFetch(api.list);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);
  async function save(values) {
    const { id, ...body } = toApi(values);
    const saved = editingId ? await api.update(editingId, body) : await api.create(body);
    setEditingId(saved.id);
    list.reload();
    return fromApi(saved);
  }
  const form = useForm(fromApi(empty), save, { successMessage: "Data tersimpan." });

  function showForm() {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current?.querySelector("input, select, textarea")?.focus({ preventScroll: true });
    });
  }

  function startCreate() {
    setEditingId(null);
    form.load(fromApi(empty));
    showForm();
  }

  function startEdit(item) {
    setEditingId(item.id);
    form.load(fromApi(item));
    showForm();
  }
  function cancelEdit() {
    setEditingId(null);
    form.load(fromApi(empty));
  }

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  function askDelete(item) {
    setDeleteError(null);
    setDeleteTarget(item);
  }

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.remove(deleteTarget.id);
      if (deleteTarget.id === editingId) {
        setEditingId(null);
        form.load(fromApi(empty));
      }
      setDeleteTarget(null);
      list.reload();
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setDeleting(false);
    }
  }

  const [localItems, setLocalItems] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [lastData, setLastData] = useState(list.data);
  if (list.data !== lastData) {
    setLastData(list.data);
    setLocalItems(null);
  }
  const items = localItems ?? list.data ?? [];

  async function move(index, delta) {
    const next = moveItem(items, index, delta);
    if (next === items) return;
    setLocalItems(next);
    setOrderError(null);
    try {
      await api.reorder(next.map((x) => x.id));
    } catch (error) {
      setOrderError(error.message);
    }
    list.reload();
  }

  return {
    items,
    status: list.status,
    error: list.error,
    reload: list.reload,
    form,
    formRef,
    editingId,
    isEditing: editingId !== null,
    startCreate,
    startEdit,
    cancelEdit,
    deleteTarget,
    deleting,
    deleteError,
    askDelete,
    cancelDelete: () => setDeleteTarget(null),
    confirmDelete,
    move,
    orderError,
  };
}
