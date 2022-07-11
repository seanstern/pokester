import React, { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import { useCreate } from "./queries/RoomsQueries";

type CreateRoomProps = {};
const CreateRoom: FC<CreateRoomProps> = () => {
  const create = useCreate();
  const history = useHistory();
  return (
    <>
      <h2>Create a Room</h2>
      <Formik
        initialValues={
          { name: "", buyIn: 1000, smallBlind: 5, bigBlind: 10 } as {
            name?: string;
            buyIn?: number;
            smallBlind?: number;
            bigBlind?: number;
          }
        }
        initialErrors={
          { name: "Required" } as {
            name?: string;
            buyIn?: string;
            smallBlind?: string;
            bigBlind?: string;
          }
        }
        validate={(values) => {
          const errors = {} as {
            name?: string;
            buyIn?: string;
            smallBlind?: string;
            bigBlind?: string;
          };
          if (!values.name) {
            errors.name = "Required";
          }
          if (values.buyIn === undefined) {
            errors.buyIn = "Required";
          } else if (values.buyIn <= 0) {
            errors.buyIn = "Must be positive";
          } else if (values.bigBlind && values.buyIn < values.bigBlind) {
            errors.buyIn = "Must be larger than big blind";
          }
          if (values.smallBlind === undefined) {
            errors.smallBlind = "Required";
          } else if (values.smallBlind <= 0) {
            errors.smallBlind = "Must be positive";
          }
          if (values.bigBlind === undefined) {
            errors.bigBlind = "Required";
          } else if (values.bigBlind <= 0) {
            errors.bigBlind = "Must be positive";
          } else if (
            values.smallBlind &&
            values.bigBlind &&
            values.bigBlind <= values.smallBlind
          ) {
            errors.bigBlind = "Must be larger than small blind";
          }
          return errors;
        }}
        onSubmit={async (values) => {
          try {
            const roomId = await create.mutateAsync(values as any);
            history.push(`/rooms/${roomId}`);
          } catch (err) {}
        }}
      >
        {(fb) => (
          <Form>
            <label>
              Room Name
              <Field type="text" name="name" />
              <ErrorMessage name="name" />
            </label>
            <label>
              Buy In
              <Field type="number" name="buyIn" />
              <ErrorMessage name="buyIn" />
            </label>
            <label>
              Small Blind
              <Field type="number" name="smallBlind" />
              <ErrorMessage name="smallBlind" />
            </label>
            <label>
              Big Blind
              <Field type="number" name="bigBlind" />
              <ErrorMessage name="bigBlind" component="div" />
            </label>
            <button type="submit" disabled={fb.isSubmitting || !fb.isValid}>
              Create
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateRoom;
