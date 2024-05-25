# General Guide, related to `general.json`

#### You can't edit me!

[Markdown](http://daringfireball.net/projects/markdown/) lets you write content in a really natural way.

- You can have lists, like this one
- Make things **bold** or _italic_
- Embed snippets of `code`
- Create [links](/)
- ...

<small>Sample content borrowed with thanks from [elm-markdown](http://elm-lang.org/examples/markdown) ❤️</small>

Custom handling of code blocks (or any rule!) is possible with the [`renderRule` option](https://github.com/quantizor/markdown-to-jsx#optionsrenderrule). For example, LaTeX support via [`@matejmazur/react-katex`](https://www.npmjs.com/package/@matejmazur/react-katex):

```latex
\mathbb{N} = \{ a \in \mathbb{Z} : a > 0 \}
```

```javascript
const name = "Kjell";
const say = (str) => console.log("Hello", str);

say(name);
```

Or any other typical language, using [`highlight.js`](https://highlightjs.org/):

You can even include custom React components.
