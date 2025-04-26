export const convertURLSearchParamsToObject = (
    searchParams: URLSearchParams
  ) => {
    let obj: any = {};
    searchParams.forEach((value: any, key: any) => {
      obj[key] = value;
    });
    return obj;
  };