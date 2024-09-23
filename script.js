// type is either 0 or 1.
// 1 = the grade for the work done in the class
// 2 = the grade for the work done at home.
// grades = 10. The correct indexing is handled in the code so
// i cba about writing descriptive variable names. I love when they're named with just a single char or two
// every variable has a comment, so you can understand what is what.
// this script is for personal use anyways, what do you care? 🤨

function openTheWindow(idx)
{
  const b = document.querySelector(`#PUPIL_ASSESSMENT_0_${idx}_NEW`); // the button to open the window.
  b.click();
}

// basically we set the interval to 100, meaning we check the element every 100 ms.
// e = elapsed time. if it goes over the timeout threshold which is default 1000, there's no element
// we return a promise which either returns the element if found or throws a new error.
// at the end of the if-else statement, e gets incremented by 100.

async function waitForElement(s, t)
{
  let i = 100;
  let e = 0;

  return new Promise((rs, rj) =>
  {
    const ch = setInterval(() =>
    {
      const el = document.querySelector(s);

      if (el)
      {
        clearInterval(ch);
        rs(el);
      } else if (e > t)
      {
        clearInterval(ch);
        throw new Error("This error is due to the script: no element was found.");
      }

      e += i;
    }, i)
  })
}

async function assignGrade(type, grade)
{
  if (!type || !grade)
  {
    throw new Error("func lacks parameters - pass in type and grade.");
  }

  const td = await waitForElement(`#OPEN_ASSESSMENT_DROPDOWN`); // wait for type dropdown
  const c = await waitForElement("#SELECT_ASSESSMENT_TYPE_0"); // wait for class selection
  const h = await waitForElement("#SELECT_ASSESSMENT_TYPE_1"); // wait for home selection
  const g = await waitForElement(`#SELECT_POINT_${grade - 1}`); // wait for selected grade element
  const sb = await waitForElement("#ASSESSMENT_POPUP_SUBMIT"); // wait for submit button

  td.click(); // opens the dropdown

  switch (type)
  {
    case 1:
      c.click(); // select class
      break;
    case 2:
      h.click(); // select home
      break;
  }

  g.click(); // select the grade
  sb.click(); // submit the grade
}


async function RunAssigner(idx, type, grade)
{
  await new Promise((resolve) =>
  {
    setTimeout(() =>
    {
      openTheWindow(idx);
      assignGrade(type, grade);
      resolve(); // Ensures that the function resolves only after assignment
    }, 1000);
  });
}

async function main()
{
  const dic = {};
  const n = [];

  // we grab every box that has a pupil name label inside.
  document
    .querySelectorAll(".pupil-name")
    .forEach((el) => n.push(el.textContent));

  // for each student, you're prompted to input a type and a grade for the student
  n.forEach((el, idx) =>
  {
    const type = prompt(`Enter the type for student (1, 2) - ${el}`);
    if (type == 0)
    {
      return;
    }

    const grade = prompt(`Enter the grade for student (1, 10) - ${el}`);
    dic[idx] = [type, grade];
  });

  for (let prop in dic)
  {
    const [type, grade] = dic[prop];
    await RunAssigner(prop, type, grade); // Await ensures the assigner finishes before moving to the next.
  }
}
