/* eslint-disable */
import { flatMap } from 'lodash';
import { writeFileSync } from 'fs';
import * as path from 'path';

const basePath = process.argv[process.argv.length - 1];

const ubuntu = {
  name: 'Ubuntu',
  base: 'ubuntu',
  icon: 'devicon-ubuntu-plain',
  tagGroups: ['Version'],
  items: [
    ['18.04', 'bionic'],
    ['18.10', 'cosmic'],
    ['19.04', 'disco'],
    ['14.04', 'trusty'],
    ['16.04', 'xenial'],
  ].map(([version, codename]) => ({
    tag: version,
    options: {
      Version: `${version} (${codename})`
    }
  })),
};

const cuda = {
  name: 'CUDA',
  base: 'nvidia/cuda',
  icon: 'fa fa-desktop',
  tagGroups: ['Operating System', 'CUDA Version', 'Flavor', 'CUDNN Version'],
  items: (() => {
    const tagList = ["10.0-runtime-ubuntu14.04", "10.0-devel-ubuntu14.04", "10.0-cudnn7-runtime-ubuntu14.04", "10.0-cudnn7-devel-ubuntu14.04", "10.0-runtime-ubuntu18.04", "10.0-devel-ubuntu18.04", "10.0-cudnn7-runtime-ubuntu18.04", "10.0-cudnn7-runtime", "8.0-runtime-ubuntu14.04", "8.0-devel-ubuntu14.04", "10.0-cudnn7-devel-ubuntu18.04", "10.0-cudnn7-devel", "8.0-cudnn6-runtime-ubuntu14.04", "8.0-cudnn7-runtime-ubuntu14.04", "8.0-cudnn6-devel-ubuntu14.04", "8.0-cudnn7-devel-ubuntu14.04", "9.2-runtime-ubuntu18.04", "9.2-devel-ubuntu18.04", "9.2-cudnn7-runtime-ubuntu18.04", "8.0-cudnn5-runtime-ubuntu14.04", "8.0-cudnn5-devel-ubuntu14.04", "9.2-cudnn7-devel-ubuntu18.04", "10.0-base-ubuntu14.04", "latest", "10.0-runtime", "10.0-devel", "10.0-base-ubuntu18.04", "10.0-base", "9.2-base-ubuntu18.04", "10.0-runtime-ubuntu16.04", "10.0-devel-ubuntu16.04", "10.0-cudnn7-runtime-ubuntu16.04", "9.2-runtime-ubuntu16.04", "9.2-devel-ubuntu16.04", "9.2-cudnn7-runtime-ubuntu16.04", "9.2-cudnn7-runtime", "9.1-runtime-ubuntu16.04", "9.1-devel-ubuntu16.04", "9.1-cudnn7-runtime-ubuntu16.04", "9.1-cudnn7-runtime", "10.0-cudnn7-devel-ubuntu16.04", "9.0-runtime-ubuntu16.04", "9.2-cudnn7-devel-ubuntu16.04", "9.0-devel-ubuntu16.04", "9.2-cudnn7-devel", "9.0-cudnn7-runtime-ubuntu16.04", "9.0-cudnn7-runtime", "9.1-cudnn7-devel-ubuntu16.04", "9.1-cudnn7-devel", "9.0-cudnn7-devel-ubuntu16.04", "9.0-cudnn7-devel", "8.0-runtime-ubuntu16.04", "8.0-devel-ubuntu16.04", "8.0-cudnn6-runtime-ubuntu16.04", "8.0-cudnn6-runtime", "8.0-cudnn7-runtime-ubuntu16.04", "8.0-cudnn7-runtime", "8.0-cudnn6-devel-ubuntu16.04", "8.0-cudnn6-devel", "8.0-cudnn7-devel-ubuntu16.04", "8.0-cudnn7-devel", "8.0-cudnn5-runtime-ubuntu16.04", "8.0-cudnn5-runtime", "8.0-cudnn5-devel-ubuntu16.04", "8.0-cudnn5-devel", "9.2-runtime", "9.2-devel", "9.0-runtime", "9.0-devel", "9.1-runtime", "9.1-devel", "8.0-runtime", "8.0-devel", "9.2-base-ubuntu16.04", "9.2-base", "9.0-base-ubuntu16.04", "9.0-base", "10.0-base-ubuntu16.04", "9.1-base-ubuntu16.04", "9.1-base", "8.0-runtime-centos6", "8.0-devel-centos6", "8.0-cudnn5-runtime-centos6", "8.0-cudnn5-devel-centos6", "10.0-runtime-centos7", "10.0-devel-centos7", "10.0-cudnn7-runtime-centos7", "9.2-runtime-centos7", "9.1-runtime-centos7", "9.2-devel-centos7", "9.1-devel-centos7", "9.2-cudnn7-runtime-centos7", "9.1-cudnn7-runtime-centos7", "10.0-cudnn7-devel-centos7", "9.1-cudnn7-devel-centos7", "9.0-runtime-centos7", "9.0-devel-centos7", "9.0-cudnn7-runtime-centos7", "9.2-cudnn7-devel-centos7", "9.0-cudnn7-devel-centos7"];
    return flatMap(tagList, (tag) => {
      const parts = tag.split('-');
      const result = {
        'Operating System': null,
        'CUDA Version': '10.0',
        'Flavor': 'Devel',
        'CUDNN Version': 'Default'
      };
      for (const p of parts) {
        if (p.includes('ubuntu'))
          result["Operating System"] = `Ubuntu ${p.substr('ubuntu'.length)}`;
        else if (p.includes('centos'))
          return [];
        else if (p.includes('cudnn'))
          result["CUDNN Version"] = `CUDNN ${p.substr('cudnn'.length)}`;
        else
          switch (p) {
            case 'base':
              result.Flavor = 'Base';
              break;
            case 'runtime':
              result.Flavor = 'Runtime';
              break;
            case 'devel':
              result.Flavor = 'Devel';
              break;
            case '10.0':
            case 'latest':
              result["CUDA Version"] = '10.0';
              if (!result["Operating System"])
                result["Operating System"] = 'Ubuntu 18.04';
              break;
            case '9.2':
            case '9.1':
            case '9.0':
            case '8.0':
              result["CUDA Version"] = p;
              if (!result["Operating System"])
                result["Operating System"] = 'Ubuntu 16.04';
              break;
            case '7.5':
            case '7.0':
            case '6.5':
              result["CUDA Version"] = p;
              if (!result["Operating System"])
                result["Operating System"] = 'Ubuntu 14.04';
              break;
            default:
              result["CUDA Version"] = p;
          }
      }
      return [{
        tag,
        options: result,
      }];
    });
  })(),
};

const tensorflow = {
  name: 'TensorFlow',
  base: 'tensorflow/tensorflow',
  icon: 'devicon-python-plain',
  tagGroups: ['Device', 'Python', 'Version'],
  items: (() => {
    function optionParser(tag) {
      const parts = tag.split('-');
      const result = {
        Python: 'Python 2.x',
        Device: 'CPU',
        Version: 'Unknown'
      };
      if (parts[parts.length - 1] === 'py3') {
        parts.pop();
        result.Python = 'Python 3.x';
      }
      if (parts[parts.length - 1] === 'gpu') {
        parts.pop();
        result.Device = 'GPU';
      }
      result.Version = parts.join('-');
      return result;
    }
    const tagList = ["nightly-devel-py3", "nightly-devel-gpu-py3", "nightly-devel-gpu", "nightly-devel", "nightly-gpu-py3", "nightly-gpu", "nightly", "custom-op", "latest-devel-gpu-py3", "latest-devel-py3", "latest-gpu-py3", "latest-py3", "latest-devel-gpu", "latest-devel", "latest-gpu", "latest", "1.12.0-devel-gpu-py3", "1.12.0-devel-py3", "1.12.0-devel-gpu", "1.12.0-devel", "1.12.0-gpu-py3", "1.12.0-py3", "1.12.0-gpu", "1.12.0", "1.12.0-rc2-devel-gpu-py3", "1.12.0-rc2-devel-gpu", "1.12.0-rc2-devel-py3", "1.12.0-rc2-devel", "1.12.0-rc2-gpu-py3", "1.12.0-rc2-py3", "1.12.0-rc2-gpu", "1.12.0-rc2", "1.12.0-rc1-devel-gpu-py3", "1.12.0-rc1-devel-gpu", "1.12.0-rc1-devel-py3", "1.12.0-rc1-devel", "1.12.0-rc1-gpu-py3", "1.12.0-rc1-gpu", "1.12.0-rc1-py3", "1.12.0-rc1", "1.12.0-rc0-devel-gpu-py3", "1.12.0-rc0-devel-gpu", "1.12.0-rc0-devel-py3", "1.12.0-rc0-devel", "1.12.0-rc0-gpu-py3", "1.12.0-rc0-py3", "1.12.0-rc0-gpu", "1.12.0-rc0", "1.11.0-devel-gpu-py3", "1.11.0-devel-gpu", "1.11.0-devel-py3", "1.11.0-devel", "1.11.0-gpu-py3", "1.11.0-py3", "1.11.0-gpu", "1.11.0", "1.11.0-rc2-devel-gpu-py3", "1.11.0-rc2-devel-gpu", "1.11.0-rc2-devel-py3", "1.11.0-rc2-devel", "1.11.0-rc2-gpu-py3", "1.11.0-rc2-py3", "1.11.0-rc2-gpu", "1.11.0-rc2", "1.11.0-rc1-devel-gpu-py3", "1.11.0-rc1-devel-gpu", "1.11.0-rc1-devel-py3", "1.11.0-rc1-gpu-py3", "1.11.0-rc1-devel", "1.11.0-rc1-gpu", "1.11.0-rc1-py3", "1.11.0-rc1", "1.11.0-rc0-devel-gpu-py3", "1.11.0-rc0-devel-gpu", "1.11.0-rc0-devel-py3", "1.11.0-rc0-gpu-py3", "1.11.0-rc0-devel", "1.11.0-rc0-gpu", "1.11.0-rc0-py3", "1.11.0-rc0", "1.10.1-devel-gpu-py3", "1.10.1-devel-gpu", "1.10.1-devel-py3", "1.10.1-devel", "1.10.1-gpu-py3", "1.10.1-gpu", "1.10.1-py3", "1.10.1", "1.10.0-devel-gpu-py3", "1.10.0-devel-gpu", "1.10.0-devel-py3", "1.10.0-devel", "1.10.0-gpu-py3", "1.10.0-py3", "1.10.0-gpu", "1.10.0", "1.10.0-rc1-devel-gpu-py3", "1.10.0-rc1-devel-gpu", "1.10.0-rc1-devel-py3", "1.10.0-rc1-devel"];
    return tagList.map(tag => ({
      tag,
      options: optionParser(tag),
    }));
  })(),
};

const deepo = {
  name: 'deepo',
  base: 'ufoym/deepo',
  icon: 'devicon-python-plain',
  tagGroups: ['Feature', 'Device', 'Python'],
  items: (() => {
    function optionParser(tag) {
      const parts = tag.split('-');
      const remaining = [];
      const result = {
        Python: 'Python 2.7 & Python 3.6',
        Device: 'CPU / GPU (CUDA 9.0)',
        Feature: 'all'
      };
      for (const p of parts) {
        switch (p) {
          case 'py36':
            result.Python = 'Python 3.6';
            break;
          case 'py27':
            result.Python = 'Python 2.7';
            break;
          case 'cu90':
            result.Device = 'GPU (CUDA 9.0)';
            break;
          case 'cpu':
            result.Device = 'CPU';
            break;
          default:
            remaining.push(p);
        }
      }
      result.Feature = remaining.join('-') || result.Feature;
      return result;
    }
    const tagList = ["all-jupyter", "all-jupyter-py36", "all-jupyter-py27", "all-jupyter-py36-cu90", "all-jupyter-py27-cu90", "py27-cu90", "all-py27", "all-py27-cu90", "caffe2-cpu", "caffe2-py36-cpu", "latest", "py36-cu90", "all", "all-py36", "cntk-cpu", "cntk-py36-cpu", "all-py36-cu90", "torch", "torch-cu90", "sonnet-py27", "sonnet-py27-cu90", "cpu", "py36-cpu", "all-cpu", "all-py36-cpu", "caffe-py27", "caffe-py27-cu90", "lasagne-py27-cpu", "caffe", "caffe-py36", "caffe-py36-cu90", "cntk", "cntk-py36", "cntk-py36-cu90", "tensorflow-py27-cpu", "sonnet-cpu", "sonnet-py36-cpu", "keras", "keras-py36", "keras-py36-cu90", "mxnet-py27-cpu", "lasagne", "lasagne-py36", "lasagne-py36-cu90", "chainer-py27-cpu", "pytorch-cpu", "pytorch-py36-cpu", "caffe-py27-cpu", "pytorch", "pytorch-py36", "pytorch-py36-cu90", "lasagne-cpu", "lasagne-py36-cpu", "cntk-py27", "cntk-py27-cu90", "chainer-py27", "chainer-py27-cu90", "tensorflow-py27", "tensorflow-py27-cu90", "tensorflow-cpu", "tensorflow-py36-cpu", "keras-py27", "keras-py27-cu90", "keras-py27-cpu", "theano-py27-cpu", "mxnet-py27", "mxnet-py27-cu90", "caffe2", "caffe2-py36", "caffe2-py36-cu90", "sonnet", "sonnet-py36", "sonnet-py36-cu90", "chainer", "chainer-py36", "chainer-py36-cu90", "darknet-cpu", "torch-cpu", "theano", "theano-py36", "theano-py36-cu90", "all-jupyter-cpu", "all-jupyter-py36-cpu", "py27-cpu", "all-py27-cpu", "all-jupyter-py27-cpu", "caffe2-py27-cpu", "mxnet", "mxnet-py36", "mxnet-py36-cu90", "tensorflow", "tensorflow-py36", "tensorflow-py36-cu90", "chainer-cpu", "chainer-py36-cpu", "lasagne-py27", "lasagne-py27-cu90", "theano-cpu", "theano-py36-cpu", "darknet"]
    return tagList.map(tag => ({
      tag,
      options: optionParser(tag),
    }));
  })(),
};

const all = {
  ubuntu,
  cuda,
  tensorflow,
  deepo
};

Object.keys(all).forEach(name => {
  const current = all[name];
  const docker = {
    name: current.name,
    base: current.base,
    icon: current.icon,
    config: [{
      label: 'Customize Docker',
      name: 'tag',
      type: 'tag-group',
      groupLabels: current.tagGroups,
      tags: current.items.map(item => ({
        tagList: current.tagGroups.map(key => item.options[key]),
        name: item.tag
      })),
    }],
  };

  writeFileSync(path.join(basePath, name + '.json'), JSON.stringify(docker, null, 2))
});