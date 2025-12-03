interface ActionResult<T> {
  success: string | null;
  error: string | null;
  data: T | null;
}

export default ActionResult;
