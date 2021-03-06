/* @flow */

import React from 'react';
import className from 'classnames/bind';

import icon from '../../../images/icon-create-dep.svg';
import Common from './Common';
import Parameters from './Parameters';
// import ImagePorts from './ImagePorts';
// import Commands from './Commands';
import Environments from './Environments';
import Volumes from './Volumes';
import ConfigMap from './ConfigMap';

import globalStyles from '../../../theme/global.scss';
import buttonsStyles from '../../../theme/buttons.scss';

const globalClass = className.bind(globalStyles);
const buttonsClass = className.bind(buttonsStyles);

const btnClassName = buttonsClass('buttonUIAddBlock', 'buttonUIAddBlockBig');

const containerClassName = globalClass('blockContainer', 'paddingX20');

const titleClassName = globalClass('containerTitle', 'marginLeft20');

type Props = {
  item: Object,
  containersCount: number,
  index: number,
  volumes: Array<Object>,
  configMaps: Array<Object>,
  handleClickContainerRemove: () => void,
  handleClickContainerAdd: () => void,
  handleChangeInputCommon: () => void,
  handleChangeInputParameters: () => void,
  // handleChangeInputImagePorts: () => void,
  // handleClickRemoveImagePort: () => void,
  // handleClickAddImagePort: () => void,
  // handleChangeInputCommands: () => void,
  handleChangeInputEnvironment: () => void,
  handleClickRemoveEnvironment: () => void,
  handleClickAddEnvironment: () => void,
  handleChangeSelect: () => void,
  handleChangeInputPath: () => void,
  handleClickRemove: () => void,
  handleClickAdd: () => void
};

const Container = ({
  item,
  index,
  containersCount,
  volumes,
  configMaps,
  handleClickContainerRemove,
  handleClickContainerAdd,
  handleChangeInputCommon,
  handleChangeInputParameters,
  // handleChangeInputImagePorts,
  // handleClickRemoveImagePort,
  // handleClickAddImagePort,
  // handleChangeInputCommands,
  handleChangeInputEnvironment,
  handleClickRemoveEnvironment,
  handleClickAddEnvironment,
  handleChangeSelect,
  handleChangeInputPath,
  handleClickRemove,
  handleClickAdd
}: Props) => {
  const fixedIndex = index + 1;
  const { id } = item;
  return (
    <div className={containerClassName}>
      <div className="col-md-12">
        <div className={titleClassName} id={`container${fixedIndex}`}>
          Container {fixedIndex}
        </div>
        {containersCount !== 1 && (
          <button
            type="button"
            className="close"
            style={{ marginTop: '-10px' }}
            onClick={() => {
              handleClickContainerRemove(id);
            }}
          >
            <span aria-hidden="true">
              <img
                src={icon}
                alt="delete"
                style={{ width: '12px', height: '15px' }}
              />
            </span>
          </button>
        )}

        <Common
          item={item}
          index={index}
          handleChangeInputCommon={handleChangeInputCommon}
        />
        <Parameters
          item={item}
          index={index}
          handleChangeInputParameters={handleChangeInputParameters}
        />
        {/* <ImagePorts */}
        {/* ports={item.ports} */}
        {/* id={item.id} */}
        {/* index={index} */}
        {/* handleChangeInputImagePorts={handleChangeInputImagePorts} */}
        {/* handleClickRemoveImagePort={handleClickRemoveImagePort} */}
        {/* handleClickAddImagePort={handleClickAddImagePort} */}
        {/* /> */}
        {/* <Commands */}
        {/* item={item} */}
        {/* index={index} */}
        {/* handleChangeInputCommands={handleChangeInputCommands} */}
        {/* /> */}
        <Environments
          env={item.env}
          id={item.id}
          index={index}
          handleChangeInputEnvironment={handleChangeInputEnvironment}
          handleClickRemoveEnvironment={handleClickRemoveEnvironment}
          handleClickAddEnvironment={handleClickAddEnvironment}
        />
        <Volumes
          volumeMounts={item.volume_mounts}
          volumes={volumes}
          id={item.id}
          index={index}
          handleChangeSelect={handleChangeSelect}
          handleChangeInputPath={handleChangeInputPath}
          handleClickRemove={handleClickRemove}
          handleClickAdd={handleClickAdd}
        />
        <ConfigMap
          configMapsMounts={item.config_maps}
          configMaps={configMaps}
          id={item.id}
          index={index}
          isContainersMore={
            containersCount === fixedIndex && containersCount < 3
          }
          handleChangeSelect={handleChangeSelect}
          handleChangeInputPath={handleChangeInputPath}
          handleClickRemove={handleClickRemove}
          handleClickAdd={handleClickAdd}
        />

        {containersCount === fixedIndex &&
          containersCount < 3 && (
            <div
              className={`${btnClassName} text-md-center`}
              onClick={() => handleClickContainerAdd()}
              onKeyPress={() => handleClickContainerAdd()}
              role="presentation"
            >
              + Add container
            </div>
          )}
      </div>
    </div>
  );
};

export default Container;
