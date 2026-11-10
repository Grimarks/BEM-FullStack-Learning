import { useState } from "react";

export function useForm(initial, saveFn, { successMessage = "Perubahan tersimpan." } = {}) {
  const [saved, setSaved] = useState(initial);
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  function set(name, value) {
    setValues((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => (previous[name] ? { ...previous, [name]: undefined } : previous));
    setStatus(null);
  }
  function bind(name) {
    return {
      name,
      value: values[name] ?? "", // null/undefined → "" supaya input tetap "controlled"
      onChange: (event) => set(name, event.target.value),
      error: fieldErrors[name],
    };
  }
  function load(next) {
    setSaved(next);
    setValues(next);
    setFieldErrors({});
    setStatus(null);
  }
  function reset() {
    setValues(saved);
    setFieldErrors({});
    setStatus(null);
  }

  async function submit(event) {
    event?.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const result = await saveFn(values);
      setSaved(result);
      setValues(result);
      setFieldErrors({});
      setStatus({ tone: "success", message: successMessage });
      return result;
    } catch (error) {
      setFieldErrors(error.fields ?? {});
      setStatus({ tone: "error", message: error.message ?? "Gagal menyimpan." });
      return null;
    } finally {
      setSaving(false);
    }
  }

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  return { values, set, bind, load, reset, submit, dirty, saving, status, fieldErrors };
}
