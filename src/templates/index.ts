export const boilerplate: Record<string, Record<string, Function>> = {
  ts: {
    regularFC: (name: string) => `import React from "react";

interface I${name}Props {}

export function ${name}(props: I${name}Props): JSX.Element {
  const {} = props;
  return <div></div>;
}
`,
    arrowFC: (name: string) => `import React from "react";

interface I${name}Props {}

export const ${name}: React.FC<I${name}Props> = (props) => {
  const {} = props;
  return <div></div>;
};
`,
    classC: (name: string) => `import React from "react";

interface I${name}Props {}

interface I${name}State {}

export class ${name} extends React.Component<I${name}Props, I${name}State> {
  state: I${name}State = {};

  render() {
    const {} = this.props;
    return <div></div>;
  }
}
`,
  },
  js: {
    regularFC: (name: string) => `import React from "react";

export function ${name}(props) {
  const {} = props;
  return <div></div>;
}
`,
    arrowFC: (name: string) => `import React from 'react';

export const ${name} = (props) => {
    const {} = props;
    return <div></div>;
}
`,
    classC: (name: string) => `import React from 'react';

export class ${name} extends React.Component {
    state = {};

    render() {
        const {} = this.props;
        return <div></div>;
    }
  }
`,
  },
};
