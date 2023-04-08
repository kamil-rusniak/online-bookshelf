export const getBookJson = async (isbn:FormDataEntryValue) => {
  try {
    const res = await fetch(
      `https://openlibrary.org/isbn/${isbn}.json`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getAuthor = async (authorCode:any) => {
  try {
    const res = await fetch(
      `https://openlibrary.org${authorCode}.json`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};