const higherOrderServerTemplate = ({
  serverPath,
  ocContextPath,
  bundleHashKey,
  componentName,
  componentVersion
}) => `
import { data as dataProvider } from '${serverPath}';
import { OC } from '${ocContextPath}';

export const data = (context : OC.Context, callback : (error: any, data?: any) => void) => {
  dataProvider(context, (error: Error | null, model: Record<string, any>) => {
    if (error) {
      return callback(error);
    }
    const props = {
      ...model,
      _staticPath: context.staticPath,
      _baseUrl: context.baseUrl,
      _componentName: "${componentName}",
      _componentVersion: "${componentVersion}"
    };
    const srcPathHasProtocol = context.staticPath.startsWith("http");
    const srcPath = srcPathHasProtocol ? context.staticPath : ("https:" + context.staticPath);
    return callback(null, Object.assign({}, {
      reactComponent: {
        key: "${bundleHashKey}",
        src: srcPath + "react-component.js",
        props
      }
    }));
  });
}
`;

module.exports = higherOrderServerTemplate;
